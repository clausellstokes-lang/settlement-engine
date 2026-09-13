### DS-DEF-2: `Defense › Threat assessment (the five readiness rows)` · `defenseProfile.scores{monster,military,internal,economic,disaster} + institutions{walls,garrison,militia,charter} + config.monsterThreat + compound.inst`
> *the five pressures, and what the town actually has standing against each*

**RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`)
**STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` ·
`Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a
`scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against
`config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution
presence flags, and `compound.inst`.
**SLOTS:** `{settlement}` `{band}` `{route}`
**SECTION-TARGET:** `defense`
**PROVENANCE + FENCE (the biggest in this cluster).** The existing
`buildThreatAssessment` lattice is genuinely dossier-native and this shape
EXTENDS it into a pool rather than replacing it — the corpus's job here is that
each branch currently holds exactly ONE string, so every settlement in a given
branch says the same words. Two standing defects are corrected in the authoring
and must not be reintroduced: the `plagued`+nothing branch leaks a lowercase
sentence lead, and the walls read must ride `defenseProfileHasWalls`, never a
presence check on `institutions.walls` — an empty `walls: []` array still
contains the key, and reading presence rather than the predicate once granted
every settlement in the product the walled bonus. Institution presence is a
STANDING fact with no recorded history; the causal clauses here are
*capability* clauses (walls without people cannot be held) and never
*historical* ones (walls built after a siege) unless the history surface
supplies the ancestry.
**PDF PARITY:** parity (`viewModel.js` defense slice).

**`Beasts & Monsters`: `plagued`, perimeter AND organized force**
1. `[ledger]` The country around {settlement} is thick with creatures. The wall's keeping and the patrols' provisioning fall under one heading, and an argument about either is an argument about both.
   - `[face]` A wall, a muster and a bounty purse are what the accounts at {settlement} carry. The bounty is the entry people ask after, and what it is paid for is out in the country.
   - `[face]` Creatures are a standing entry in the country around {settlement}, not a piece of news. The wall stands, the people are under arms, and the returns carry the cost of both.
   - `[face]` The roll at {settlement} says who can be put out, and those who go into the country say what part of it they will not cross alone. Both entries stand in the record.
2. `[street]` Defense at {settlement} is not an emergency arrangement. The wall has people on it, the patrols go out, and what they go out into is full of creatures.
   - `[face]` The gate at {settlement} takes the day's last traffic and then the bar goes across, and what is outside the bar stays outside until morning.
   - `[face]` Money, not creatures, is what gets argued over at {settlement}. The bounty is the item, and the arguing is done where the muster can hear it.
   - `[face]` A stretch of the road out of {settlement} is not taken alone. The town does not think that needs explaining, and it keeps a wall up and a guard on it all the same.
3. `[unfolding]` What stands at {settlement} is a wall and a muster. What is left open is the country beyond them, and it is full of creatures.
   - `[face]` The wall at {settlement} is older work than the purse that keeps it up, and the guard is paid out of that purse. Neither says anything about what is in the country tonight.
   - `[face]` The people who walk the wall at {settlement} tell the country one way and the people who pay for the walking tell it another, and the town takes neither side.
   - `[face]` A wall is up at {settlement} and a muster with it. Beyond both lies the country, and it keeps its creatures.

**`Beasts & Monsters`: `plagued`, perimeter but NO force to hold it**
1. `[ledger]` The defences at {settlement} are entered as standing, and under them the roster leaves a blank where a garrison or a militia would be named. The same entry has the country outside plagued with creatures.
   - `[face]` No garrison is seated at {settlement} and no militia is raised, and the works stand without either. Their inner face is where the town keeps what it does not leave outside after dark, and the reason is the plagued country.
   - `[face]` Creatures work the country around {settlement}, and the town answers with built work. Neither a garrison nor a militia is seated behind the built work.
   - `[face]` Plagued country lies outside {settlement}, and the works that face it carry no garrison and no militia. Who goes out into that country, and how far out, is settled between the people who go.
2. `[visitor]` A stranger walking in at {settlement} is told the hours before anything else, and the works on the way are good work with no garrison and no militia behind them. The country outside is plagued, and the hours are kept as carefully as the works.
   - `[face]` The animals at {settlement} are brought inside the works before dusk, and a stranger arriving late enough to watch it done has the plagued country explained without asking. The town seats no garrison and raises no militia.
   - `[face]` Coming up to {settlement} out of plagued country, a stranger meets works that are good and a town that has neither a garrison nor a militia. Nothing is left stacked against the outer face, and the reason is not explained to strangers.
   - `[face]` Good work stands at {settlement} with no garrison in it and no militia, and the country outside is plagued. People going out on an errand carry more than the errand needs, and a stranger is not told why.
3. `[unfolding]` The works at {settlement} stand to a plagued country, and the town's arrangements seat neither a garrison nor a militia in them. The ground outside is kept clear, and the keeping of it is somebody's work.
   - `[face]` Stores lean against the inner face of the works at {settlement}, and the short way across the town runs along beside them. The roster shows no garrison and no militia, and the country outside is plagued.
   - `[face]` The country at {settlement} is plagued and the works are sound, and the town seats neither a garrison nor a militia in them. Who decides when everything comes inside is not in the record.
   - `[face]` Neither a garrison nor a militia stands to the works at {settlement}, and the works are good work. Water is fetched in company, and the plagued country is the reason.

**`Beasts & Monsters`: `plagued`, NO perimeter and NO force**
1. `[ledger]` Under this heading the record gives {settlement} a country thick with creatures, no wall to the town and no garrison or muster of its own. It gives nothing after that.
   - `[face]` Nothing is drawn round {settlement}, and no garrison or muster stands inside it. The beasts that work the open ground come up to the doors of the houses.
   - `[face]` At {settlement} the stock comes in close at dark. The town has no wall for it to come in behind, no garrison, no muster, and a country outside full of things that feed on it.
   - `[face]` The ground runs up to {settlement} on every side with nothing to stop at, no garrison or muster is kept here, and whose business it is to meet what walks in off a plagued country is not settled in the town.
2. `[street]` What {settlement} does about the beasts in the country is done door by door, with no wall to stand on and no garrison or muster to turn out. In the town it is spoken of as an arrangement.
   - `[face]` The argument at {settlement} is whose stock is loose in the road once the light goes, and not what a loose animal draws in from the fields. With no wall to shut and no garrison or muster to call, the argument is what fills the evening.
   - `[face]` Something heard in the fields at night is a household matter at {settlement}. No line runs round the town, no garrison sits in it, no muster comes out of it, and what is heard out there is not always stock.
   - `[face]` That {settlement} has no wall, no garrison and no muster is not a thing the town discusses. What is in the country after dark, it discusses.
3. `[visitor]` A stranger arriving at {settlement} crosses nothing to get in and cannot say afterwards where the town begins. No garrison quarters here and no muster is called, and beasts work the country on every side.
   - `[face]` The wall a stranger looks for at {settlement} is not there, and the garrison and the muster asked after go the same way. What is out in the fields beyond the last houses is told at length by whoever is asked.
   - `[face]` The way into {settlement} is not arranged as though anything were to be stopped on it: no wall crosses it, no garrison watches it, no muster forms on it. The creatures of the country use it as freely as anybody with business on it.
   - `[face]` A house with room in it takes a stranger in at {settlement}, and the shutter is barred from the inside. The town keeps no wall, no garrison and no muster, and what moves in the country when the houses are shut is the shutter's business.

**`Beasts & Monsters`: `frontier`, credible deterrence**
1. `[ledger]` An active frontier lies outside {settlement}, and what the town keeps against it is works with a force to stand on them. What the country holds is not entered at all.
   - `[face]` The country outside {settlement} is entered as an active frontier, and beside that entry stands the town's own: works, and a force.
   - `[face]` Works stand at {settlement}, a force goes up on them, and past both lies an active frontier.
   - `[face]` Keeping the ground outside the works clear is a standing duty at {settlement}, shared out among the force, and the frontier is what the entry gives as its reason.
2. `[street]` The frontier is spoken of in the town as a duty and not as a danger, and a night on the works is grumbled at like any other night's work.
   - `[face]` Children play on the works. At dusk whoever is up there calls the children in, and the town finds neither half of that worth a remark.
   - `[face]` Argument in the town runs on the rota rather than on the frontier itself: whose name comes round on the works, and who contrives to be elsewhere.
   - `[face]` One corner of the works is left alone after dark, and nobody who stands the rest of them will say why, only that the country out there is frontier.
3. `[counterforce]` Coming at {settlement} out of the country means coming at works, and at whoever is put on them, and the town would rather that were understood than tested.
   - `[face]` No rule at {settlement} forbids sleeping outside the works, and nobody does. The country is frontier and the works are held, and a rule would be a formality.
   - `[face]` A bounty stands at {settlement} for what is carried in out of the country, and the paying and the standing fall to the same hands.
   - `[face]` Patrols go out of {settlement} into the country and come back. The works cannot go anywhere, and on a frontier that is the difference between them and the force.

**`Beasts & Monsters`: `frontier`, force without a perimeter**
1. `[ledger]` The frontier country around {settlement} is answered by armed people and by no wall at all. Whatever comes chooses the place, and the town arrives afterwards.
   - `[face]` Nobody is stopped on the way into {settlement} and nobody is turned away. What the town has is a muster, and a muster is in one place at a time.
   - `[face]` Nothing is kept out of {settlement}. What comes off the frontier is met by the town's own people, inside the town.
   - `[face]` Wherever the people under arms at {settlement} stand, the houses furthest out are on the wrong side of nothing at all.
2. `[visitor]` A stranger reaches {settlement} without being stopped, asked or turned aside. Whoever the town has under arms is met further in, and met by accident.
   - `[face]` The last house on the way into {settlement} is simply the last house. A stranger is well inside the town before meeting anybody armed.
   - `[face]` By whatever way a traveller comes to {settlement}, nothing on it says where the town begins. The people who would do the meeting stand somewhere within, and where they are wanted is not their choice.
   - `[face]` Anyone arriving at {settlement} can see the arrangement whole before anybody explains it: frontier country, armed people, and no work standing between the country and the town.
3. `[street]` The town can answer trouble and cannot prevent it, and whether the one is worth as much as the other is an argument that stands open.
   - `[face]` Word comes in at night and the muster goes one way and not the other. The part of the town it leaves behind is a part of the town.
   - `[face]` The town does not close at dark, and it does not pretend to. Trouble is answered where it happens to be, and answering is all the town claims.
   - `[face]` The complaint in the town is not that it keeps armed people. It is that armed people go to a place, and the places they do not go to are also the town.

**`Beasts & Monsters`: `settled`, defenses beyond the need**
1. `[counterforce]` Whatever the works at {settlement} are kept up for, it is more than the creatures of this country ask of them; what else they would answer is nobody's to say.
   - `[face]` Children take the short way across the works at {settlement}, and the town leaves them to it. What comes out of this country asks less of the place than the works would answer.
   - `[face]` The works at {settlement} stand beyond anything the creatures of this country press for, and the outer side of them is left to whatever grows there.
   - `[face]` The keeping of the works at {settlement} is let out with the town's other contracts, and the country is not what hurries whoever takes it on.
2. `[ledger]` Against beasts {settlement} is provided past its need, and the provision goes into the accounts as one line with no note against it.
   - `[face]` Whoever makes the returns at {settlement} enters the works under a heading no one is asked to defend, and the works outrun the heading.
   - `[face]` The books at {settlement} enter the works against creatures. The carters treat them as the edge of the town, and nothing in the record decides between the two.
   - `[face]` The charge for the works at {settlement} falls in full against a country the record calls settled, and the entry goes in without comment.
3. `[visitor]` The first thing a stranger meets at {settlement} is the works. The road in suggests nothing they would be for.
   - `[face]` Washing hangs along the works at {settlement} and a footpath crosses them, and a stranger who stops to look at it gets no explanation.
   - `[face]` A stranger at {settlement} takes the works for the mark of a dangerous country and is put right by the town without much ceremony.
   - `[face]` What stands at {settlement} is more work than this country asks of it, and a stranger sees as much from the road before anybody says so.

**`Beasts & Monsters`: `settled`, nothing organized**
1. `[ledger]` Quiet country lies round {settlement}, and the town keeps no work at its edge. Where the buildings stop, the town stops.
   - `[face]` In heartland country the record at {settlement} runs empty in the places a defence would be entered: no bank, no barracks, no muster.
   - `[face]` Walls and a standing muster belong to the frontier. The country around {settlement} is settled, and the town has neither.
   - `[face]` Why nothing stands round {settlement} is entered nowhere. The quiet of the country is not the reason the record gives, because the record gives none.
2. `[street]` No muster forms here, and the country is the quiet kind.
   - `[face]` Nowhere here is kept clear for a turnout, and the space that would serve stands in use for something else. In settled country none is wanted.
   - `[face]` People come in off the country with nothing at the way in set to meet them. The country out there is heartland, and the town leaves it at that.
   - `[face]` Everything the town keeps up faces inward. The quiet country at its back is the one direction nothing is turned toward.
3. `[visitor]` A stranger walking out of {settlement} has nothing to pass. No bank stands in his way and no bar lifts for him, and beyond the last building lies quiet country.
   - `[face]` Nothing at {settlement} stops a stranger long enough to take his name, going out or coming back. The country he walks into is the settled kind.
   - `[face]` Out beyond {settlement} a stranger finds tracks that go somewhere and nothing set against them. That is what a heartland looks like from a town that keeps no line.
   - `[face]` Getting into {settlement} takes no leave and no answer: the town keeps no line to be let through, and settled country runs up to the doors.

**`Invasion & War`: walls AND professional garrison**
1. `[ledger]` The books at {settlement} carry the works and the men's wages under one head. The wage is entered; the names are not.
   - `[face]` Keeping the defences and keeping men in pay are one duty in the reckoning at {settlement}, and no clerk here is asked to choose between them.
   - `[face]` Against invasion the entry at {settlement} shows a work and a force, and the town is charged for both whether or not anything comes.
   - `[face]` The men in pay at {settlement} are kept rather than called out, and what keeps them is the same charge that keeps the work up.
2. `[visitor]` A stranger coming up to {settlement} sees the work before he learns that men are kept for it, and it is the keeping that makes an attempt dear.
   - `[face]` The work at {settlement} is what a stranger sees from outside. That men are kept for it is what he is told before he asks.
   - `[face]` An attempt on {settlement} would be charged for the work and charged again for the men kept for it. The charge for the men is the one nobody prices in advance.
   - `[face]` Travellers in and out of {settlement} say the same of the place. The work is up, and the keeping of it is a paid trade.
3. `[street]` The argument in this town is over what the works cost, never over whether they would serve. Men are kept for them, and the wage for the men is the same argument.
   - `[face]` Children play at the foot of the works here and are not called off. The work stands, and men are kept at a wage to keep it standing.
   - `[face]` A work standing and a wage that keeps men for it is what the town counts on. What is said about those men is another matter, and it is not said to them.
   - `[face]` The town's position is that it could be held. That position rests on a work that stands and a wage that is paid.

**`Invasion & War`: walls with citizen militia**
1. `[ledger]` Entered against {settlement}: works, and the town's own people to stand in them. A raid is the sort of trouble that arrangement answers; a company arriving with engines is not.
   - `[face]` The roll at {settlement} is kept by the muster it names, and the names on it belong to people with other work. Trouble that arrives in a hurry is what that answers; a siege train asks a different question.
   - `[face]` Walls stand at {settlement}, and the duty of standing in them falls to people with a living to make besides. A raiding party would be met that way; an army would not.
   - `[face]` Against raiders, the works at {settlement} and the people on them are an answer. Against a company that does this for its living, they are the same works and the same people.
2. `[street]` The town would turn out, and what the turning out costs is somebody's living.
   - `[face]` Whose turn it is to stand is a settled question in the town's own telling and an unsettled one door to door.
   - `[face]` Whatever a household sends to the muster is work it is not getting done at home, and the arrangement runs on that.
   - `[face]` In the town the word for it is turning out, never defense, and the difference is meant.
3. `[unfolding]` What stands at {settlement} would meet a raid and hold. Past that the arrangement is a roll of names and whoever answers to it, and the town leaves open what that comes to.
   - `[face]` A raid at {settlement} is the thing the muster is for. Anything that comes slower and in better order is the thing the town has no settled answer to, and the matter sits there.
   - `[face]` The works at {settlement} are held by people with other work waiting on them. What the arrangement is good for past a raid is not a settled matter in the town.
   - `[face]` Trouble that does not stay is what {settlement} is arranged for. Trouble that means to stay is a matter the record does not carry to its end.

**`Invasion & War`: walls with NO force**
1. `[ledger]` {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else.
2. `[visitor]` A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it.
3. `[street]` The town has the thing that would save it and not the people who would use it, and says so when pressed.

**`Invasion & War`: force with NO walls**
1. `[ledger]` Against invasion {settlement} enters a paid force and no works. The force turns back a raid and cannot hold a siege, and the town's defense is paid out in wages rather than in stone.
   - `[face]` The town's defense account at {settlement} carries a garrison and no work standing round the place. A garrison is good against a raid and not a thing that holds a siege.
   - `[face]` No work at {settlement} stands to be held, so a siege is past the town's power. What answers a raid instead is a force on the town's wage.
   - `[face]` A raid the force at {settlement} can meet, and a siege it cannot. The same purse answers for works and for wages, and with no works standing it answers for the men.
2. `[street]` What holds {settlement} is men, with nothing built around the town. Stone would have to be broken; men would only have to be missed.
   - `[face]` At {settlement} the defense is men and no works. The complaint in the town is that men have to be somewhere, and a wall does not.
   - `[face]` Asked what {settlement} would do about an army, the town names men and no works. Asked what an army would do, it names the roads that go round the men.
   - `[face]` Men rather than works defend {settlement}, and men can be walked around. The town says so and says no more.
3. `[visitor]` A stranger meets no edge coming into {settlement}, only country giving way to houses with armed men somewhere among them. A fight here would be decided among the houses.
   - `[face]` The garrison at {settlement} is quartered among houses, and a stranger goes by it without knowing. No work stands round the town to keep a fight off those streets.
   - `[face]` What a stranger cannot find at {settlement} is a wall, a palisade or an earthwork for the men to be set behind. A fight would go where the men went, and men can go the wrong way.
   - `[face]` Roads bring a stranger into {settlement} and stop at doors, with no wall or earthwork between. The men under arms are behind those doors, and a fight here would find them at home.

**`Invasion & War`: militia only**
1. `[ledger]` The muster at {settlement} can be called, and the town keeps no works to call it to. That is an answer to a raiding band and a list of names to an army in order.
   - `[face]` A raiding party is the shape of trouble the arrangement at {settlement} answers, and the answer stops there. A force under orders would find no line standing at the edge of the town.
   - `[face]` Calling the muster at {settlement} stops the work of those called, and that stopped work is the whole cost of it. The trade is a good one against a band with no plan and no trade at all against a campaign.
   - `[face]` Against war the entry for {settlement} reads a body and no works, and nothing in the record reconciles the two. Raiders meet the body, and anything that arrives in order meets the gap.
2. `[street]` The town can raise its muster and knows what the muster is for. An army under a commander is not what it is for, and that is understood here without being said.
   - `[face]` On an ordinary day the muster is invisible and those on it are at their trades. It comes out of the houses when it is called, and a force that soldiers for a living is not stopped by a thing that lives in houses.
   - `[face]` Where the muster forms is settled on the day it forms, because the town has no line and nothing to gather behind. A raiding band meets the town as it finds it, and a force with a plan does the choosing.
   - `[face]` Planning here goes as far as a band on the road and no further, and the town does not call that a failing. What it plans with is a duty on its own people, and the duty comes with no place to put them.
3. `[visitor]` A stranger comes into {settlement} without being stopped and meets armed townspeople well inside it. An army would not have to break anything to stand where he is standing.
   - `[face]` Weapons at {settlement} turn up in the hands of people who have trades, and a stranger can see where those hands go the rest of the day. None of it looks like a company under orders.
   - `[face]` Nothing bars the way into {settlement}, and a stranger is among the houses before the town has any account of him. An army coming up behind him would be stopped by exactly as much.
   - `[face]` Directions to the defence of {settlement} end at people and never at a place, because the town keeps no works to point him at. Raiders are met by the people, and a campaign asks after the place.

**`Invasion & War`: neither walls nor force**
1. `[ledger]` Against war the entry for {settlement} reads no wall, no soldiers of the town's own, and no roll. The houses stop, and nothing is set between them and the country.
   - `[face]` The tools in the houses at {settlement} are the tools of the fields, and against war that is what the town has. Nothing stands at its edge, no barracks is built in it, and nothing in it is drilled.
   - `[face]` A defence against war is set down under the works and under the men, and at {settlement} neither head carries anything. Whatever comes up the approach is seen from the fields before it is seen from the houses.
   - `[face]` The cheapest work a town can put round itself is a ring of stakes, and {settlement} has not got that. No soldiering is done on the town's account, and no list is kept.
2. `[counterforce]` A wall against an army wants timber or stone, a drilled body wants the town's own men, and soldiers want paying. None of it is done at {settlement}.
   - `[face]` Nothing at {settlement} is quartered or drilled at the town's own charge, and nothing stands round it that an army would meet. Where the town ends is a question for whoever holds the ground.
   - `[face]` The ground is worked right up to the houses at {settlement}, where another town would keep a bank and a ditch. Against an army it keeps neither soldiers nor drilled men.
   - `[face]` Set against war, {settlement} has no work standing at its edge and no soldiers of its own. No roll is kept in the place.
3. `[street]` Against an army the place keeps no soldiers of its own and no drill, and the building stops at the last house on the way out.
   - `[face]` No evening in the place is given to a drill, no work in it goes to a wall, and no soldiering is done on its own account against an army.
   - `[face]` What the place has not got is a wall, soldiers of its own, or a drill against an army.
   - `[face]` With nothing to shut at the edge of the place, no roll in it and no soldiers that answer to it, what the people there have instead of a wall is the country.

**`Internal Security`: full legal chain (court AND prison)**
1. `[ledger]` A matter at {settlement} is settled in one place and a person is kept in another. The second waits on the first.
   - `[face]` Before a magistrate at {settlement} a dispute is heard out. In the cells a person waits on the same hearing.
   - `[face]` The court at {settlement} keeps the papers, the cells keep the people, and the papers settle who goes home.
   - `[face]` The cells at {settlement} are older work than the court they answer to, and the order of it is not explained.
2. `[street]` A wrong done at {settlement} has somewhere to be taken and somewhere to be kept, and neither place is whoever happens to be nearest.
   - `[face]` One door takes a building permit, a levy and a quarrel over a boundary. At {settlement} the cells take the rest.
   - `[face]` Two ways lead out of the cells at {settlement}, a decision or a payment. For a person who can reach neither, the record has no word.
   - `[face]` Court and cells at {settlement} come out of one purse, and a shortfall in it falls on both of them or on neither.
3. `[visitor]` A stranger arriving at {settlement} with a complaint is pointed to one building; a stranger who is the complaint is held in the other.
   - `[face]` At the court door at {settlement} the business is other people's: a deed witnessed, a tax paid, a name put on a register. The cells are what a stranger gets told about.
   - `[face]` A newcomer can stand in front of the court at {settlement} without knowing it, and makes no such mistake about the cells.
   - `[face]` What an outsider brings to the court at {settlement} is taken in and written down. Whether it ends in the cells or in a fee is settled out of sight.

**`Internal Security`: court without detention**
1. `[ledger]` {settlement} enters a wrong in the same book as a licence and a levy, with nowhere to put the person while the entry is written. What answers it is a fine or a banishment.
   - `[face]` The line that pays for order at {settlement} carries a gaol in its name and no gaol under it. What is heard here is answered in coin or in distance, because keeping a person is beyond the town.
   - `[face]` Coin and the road are what {settlement} sets against a wrong, and neither falls the same way on one house as on the next. Nothing is kept here but the entry.
   - `[face]` A grievance and a deed wait in the same line at {settlement} and are settled at the same table. What leaves that table is coin, or a person on the road, because there is nowhere to keep one.
2. `[street]` The town can put a name to a wrong and cannot put a hand on whoever did it, so it charges money or sends the person off.
   - `[face]` A matter is heard, and the one it concerns leaves by the same door as the people who come to watch. Nothing is done with a person here, so the town takes coin or an empty house.
   - `[face]` Some wrongs come to the law here and some are settled between houses. The ones that come in are named, and then paid for or walked away from, because nobody is kept.
   - `[face]` A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here. Naming is what the law can do; keeping is not.
3. `[unfolding]` Whatever can be decided at {settlement} is decided, and the town holds no one past the deciding. The one who will neither pay nor go is where the arrangement runs out.
   - `[face]` A permit at {settlement} is finished where it is asked for, and a wrong is finished as far as the naming and no further. The part that would need a person kept has no place to be done.
   - `[face]` Nothing stands between a finding at {settlement} and the answer to it, because the town has no room to put a person in the meantime. A fine and a departure are near to hand, and neither needs a door that locks.
   - `[face]` A judgement at {settlement} is the whole of the town's part, because there is nowhere to keep the person it falls on. Paying or walking is that person's own choice, and the record says nothing about a refusal.

**`Internal Security`: detention without process**
1. `[ledger]` Law at {settlement} runs as far as the keeping of a person and stops there. What would decide the keeping is not entered anywhere.
   - `[face]` A locked door at {settlement} is ordinary furniture, and the whole of what stands behind it is whoever turns the key.
   - `[face]` The allowance for law at {settlement} has a head for keeping prisoners and a head for deciding. The town has nothing to spend the second on.
   - `[face]` The cells at {settlement} do their work. Nothing above them answers for what they hold.
2. `[visitor]` A stranger at {settlement} can be put somewhere. A stranger who wants something put right has nowhere to bring it.
   - `[face]` Held at {settlement} means a door that locks. Punishment means something the neighbours can stand and watch, and a stranger will find nobody in the town who owes an account of either.
   - `[face]` Strangers at {settlement} settle a quarrel where it starts and do not let it travel. A quarrel that travels reaches a cell, and a cell is where the town's law runs out.
   - `[face]` In a town with courts a stranger would have somewhere to be wrong. At {settlement} the wrong itself is never established, and the person is held all the same.
3. `[street]` Putting a person away at {settlement} is a thing the town can do and cannot account for. On whose word it is done is not a question anybody asks.
   - `[face]` A knife is not the only thing that gets a person taken up at {settlement}. Owing money will do it, and nobody in the town is charged with telling the one case from the other.
   - `[face]` A person can be held at {settlement} and nothing in the town's week makes an occasion for saying why. Among the people who live there the holding is a fact and the reason is not.
   - `[face]` The people {settlement} holds get fed, and nothing in writing anywhere says what for.

**`Internal Security`: no legal infrastructure**
1. `[ledger]` A matter at {settlement} is heard where the parties are standing, for want of a room to hear it in and anywhere to keep them apart.
   - `[face]` Whoever is wronged at {settlement} is answered before the company breaks up. The town has no room to come back to and nowhere to keep the other party until morning.
   - `[face]` Custody and a hearing room are what {settlement} does without; the hearing is whoever is within earshot.
   - `[face]` Everything a hearing needs at {settlement} is borrowed: the room from one household, the bench from the next. The town keeps no cell.
2. `[street]` The town settles its own quarrels where they begin. No room is set apart for the purpose, and nothing in the place can hold a man.
   - `[face]` Quarrels are heard in the open. Nobody is kept overnight.
   - `[face]` What passes for a hearing is whoever is standing about when the argument starts. What passes for a gaol is a promise, made in front of the same people.
   - `[face]` Whatever is decided here is decided by people who go on living next to each other. No door shuts on it, and nothing keeps a man here but his own business.
3. `[visitor]` A stranger wronged at {settlement} is pointed toward people rather than a door. No room here is appointed to the business, and at the end of it no cell.
   - `[face]` A traveller through {settlement} passes no bench set apart for a hearing and no door the town could lock a man behind.
   - `[face]` Whoever brings a complaint into {settlement} brings it to people and not to a place, and what he leaves behind when he goes is nothing the town can hold.
   - `[face]` Asking at {settlement} where a wrong is answered gets a person and not an address, and what that person can do stops short of a room and a lock.

**`Economic Survival`: `STRONG`**
1. `[ledger]` A crisis that runs long is answered at {settlement} the same way a short one is, and the long one is the answer that costs.
   - `[face]` No building at {settlement} holds what the town could spend on a bad stretch.
   - `[face]` Carts hired at {settlement} when something goes wrong go on being hired, and the going on is the expensive part of any answer the town makes.
   - `[face]` What would answer a long pressure at {settlement} sits idle while nothing is wrong, and the spending of it is settled nowhere.
2. `[street]` When something goes wrong here, the work already let out goes on being done, and the trouble is one thing happening rather than the only thing happening.
   - `[face]` The town can carry a long emergency, and what that is worth when nothing is wrong is a question that gets different answers here.
   - `[face]` A bad season here would not change the shape of the week.
   - `[face]` Whatever is put in hand here when trouble comes stays in hand while the trouble lasts. What it costs to keep it there is argued over and paid.
3. `[counterforce]` Trouble at {settlement} stays one trouble, and paying for it does not open another somewhere else in the town.
   - `[face]` Nothing at {settlement} is set aside to pay for what is going wrong, and the work that has nothing to do with the trouble is left alone.
   - `[face]` Something going wrong at {settlement} brings no collection round, and no list is drawn up of who must give what. The answer comes out of the ordinary running of the place.
   - `[face]` A pressure at {settlement} does not breed another, and what holds it to the one is the spending the town can keep up rather than any run of luck.

**`Economic Survival`: `ADEQUATE`**
1. `[ledger]` {settlement} can fund a short crisis. A long one begins eating reserves within a few months, and the reserves are not deep enough to hide that from anybody.
2. `[unfolding]` The town's capacity to pay for its own emergencies is real and finite, and every season of pressure moves the finite part closer.
3. `[threshold]` {settlement} can pay for a crisis of the ordinary length; the edge of what it can fund lies a few months past the beginning of one, and the town has not been asked to find out where.

**`Economic Survival`: `WEAK`**
1. `[ledger]` What {settlement} could put behind a crisis is decided in advance of the crisis, and decided by what the town is doing when nothing is wrong.
   - `[face]` Carriage, relief and the stopping of other work are what a trouble costs {settlement}, and the town is short of each before it begins.
   - `[face]` Nothing at {settlement} stands ready against a trouble the town cannot name, and an answer to one comes out of work going elsewhere.
   - `[face]` One answer at a time is what {settlement} manages, and the work that stops to give it is the price.
2. `[street]` The account {settlement} gives of what it could do about something sudden is a list of the things that would have to stop.
   - `[face]` Whoever would have to carry {settlement} through something is carrying a load of their own, and that load goes down when the town calls.
   - `[face]` A sudden call at {settlement} falls on whatever the town is doing instead, and the argument that follows is about what the place can spare.
   - `[face]` Somebody at {settlement} asked what the town would do about a thing gone wrong answers by naming the work they would have to put down.
3. `[unfolding]` Trouble at {settlement} does not find a town with nothing. It finds a town with nothing free.
   - `[face]` When more is asked of {settlement} than it can answer, something goes unanswered, and nothing in the place decides beforehand what gets left.
   - `[face]` The shortage at {settlement} is not a thing a stranger could be walked to. The town is arranged around it all the same.
   - `[face]` What a trouble at {settlement} would want and what the town can reach for in a hurry are not the same thing, and it is the reach that comes up short.

**`Economic Survival`: `CRITICAL`**
1. `[ledger]` A sustained pressure asks a town for hands taken off other work and somebody to send them. At {settlement} the asking finds nobody it belongs to.
   - `[face]` Anything that runs long at {settlement} comes down to errands, and whose errands they are is a question the town leaves open.
   - `[face]` Should something press on {settlement} and not let up, it would be met by whoever could be got hold of, and none of that would be arranged beforehand.
   - `[face]` The town can spare what it can spare. Anything at {settlement} that runs past that goes unmet.
2. `[unfolding]` A pressure that runs on stops asking the town what it holds and starts asking what it can set moving, and the moving is what the town cannot do.
   - `[face]` Whatever the town holds is not the difficulty. Turning it into an answer is, and nothing in the town is set up to do it.
   - `[face]` A weight that keeps on wants carrying at the start and arranging after that, and the town is good for the carrying and not the arranging.
   - `[face]` When something serious begins, nothing in the town begins with it.
3. `[street]` What gets said at {settlement} when something needs seeing to is that somebody ought to, and the sentence stops there.
   - `[face]` An emergency at {settlement} would fall on people who have work of their own, and getting word to them is left to whoever thinks of it.
   - `[face]` A job at {settlement} that is no one's in particular waits; that is the kind of job a bad business is made of.
   - `[face]` People at {settlement} can describe what would need doing if something went badly wrong, and nobody can say who would begin it.

**`Disasters & Famine`: granary AND hospital**
1. `[ledger]` Grain is kept at {settlement} against a harvest that fails, and the house that answers sickness is a religious foundation.
   - `[face]` What {settlement} sets against hunger is grain under a keeper, and what it sets against sickness is a house that answers to its faith. Between them they are what a household with nothing falls back on.
   - `[face]` The grain at {settlement} is nobody's own, and neither is the house that answers sickness. A household that wants either must ask.
   - `[face]` At {settlement} the grain is a matter of storage and sickness a matter of religion. The town names them in one breath.
2. `[street]` The town has grain and a religious house that answers sickness, and it takes having both for ordinary. A town with one and not the other takes it otherwise.
   - `[face]` Because the grain belongs to nobody in particular, the one who keeps its door is worth being on good terms with. Nobody says the same about the house that meets sickness.
   - `[face]` What the grain is for is clear; what the religious house can do when sickness comes is not. That question goes unsettled.
   - `[face]` Hunger and sickness are both a house's business in the town, and neither house asks what a household can pay.
3. `[counterforce]` Against a failed harvest {settlement} has grain, and against an outbreak a house of religion. Ground for the dead is kept regardless.
   - `[face]` Neither a failed harvest nor an outbreak finds {settlement} with nothing standing against it: the grain is one answer and a religious house is the other.
   - `[face]` Some towns keep grain and cannot answer sickness; others answer sickness and keep no grain. Both stand at {settlement}.
   - `[face]` Hunger meets a locked door at {settlement}, and sickness meets a house kept by the faithful. The town does not say which of them it trusts.

**`Disasters & Famine`: granary AND parish care only**
1. `[ledger]` The granary at {settlement} is for grain and the parishes are for the faith. For sickness the town keeps no house at all.
   - `[face]` Parish churches at {settlement} are in the town and so is the granary. No monastery is here, and no friary, and no hospital.
   - `[face]` Against hunger {settlement} has a building; against sickness it has parishes, and a parish is no hospital.
   - `[face]` Somebody at {settlement} holds the granary key and somebody else the parish doors, and no key in the town opens a house for the sick.
2. `[street]` Here the granary is not thought about and neither are the parishes. Where a sick household is to go is thought about, and it is not settled.
   - `[face]` Ask for the granary and it is pointed out, and the same for any of the parishes. Ask where the sick are taken and the pointing stops.
   - `[face]` People here take the granary for granted and do not take the parishes for a hospital. When a sickness comes the town prays, and the sick keep to their own beds.
   - `[face]` The town has somewhere for its grain, parishes for its faith, and no quarter anybody keeps clear of, because nothing here gathers the sick together.
3. `[visitor]` A stranger at {settlement} finds the granary without asking and the parishes without looking. What is looked for next and not found is anywhere the sick are taken.
   - `[face]` From the street at {settlement} the granary reads as one thing and the parishes as another. Neither reads as a place for the ill.
   - `[face]` Whoever comes new into {settlement} is shown the granary and sees the parish churches on the way. Of a hospital there is nothing to show.
   - `[face]` The parishes at {settlement} keep their own burial grounds, and a stranger bound for the granary passes them without remark. Nothing else in the town is set aside for what a sickness leaves.

**`Disasters & Famine`: granary, NO medical provision**
1. `[ledger]` {settlement} has a grain store against a failed harvest and nothing at all against disease. Hunger has an address in this town and sickness has none.
   - `[face]` Grain at {settlement} is held in common and the weighing is somebody's charge. A fever belongs to the household it lands in, and no provision of the town's would lift it off them.
   - `[face]` For its grain {settlement} has a store. For the sick it has neither house nor office, and what stands in their place is a neighbour.
   - `[face]` Nothing on the roster at {settlement} answers a sickness. The grain does better, with a building of its own and somebody answerable for the key to it.
2. `[unfolding]` The town's answer to hunger is a building. Its answer to a fever is the house the fever is in, and whoever else is under that roof.
   - `[face]` A sickness that comes into this town finds no building meant for it, and no door to knock at but a private one. Grain that comes in finds a building.
   - `[face]` The dead in this town have ground of their own, and the grain has a roof of its own. Between those provisions, the sick have the house they are in.
   - `[face]` A sick person in this town is a household matter and goes on being one. The town keeps nothing that would come to the door.
3. `[street]` At {settlement} grain is carried to a store. A sick person is carried nowhere, and stays in the room they are in.
   - `[face]` A traveller who takes a fever at {settlement} becomes a householder's business. No office in the town would take that business off the householder.
   - `[face]` Sacks go up into the store at {settlement}. A fever goes into a house and stays there, and the neighbours keep a distance that goes by no name.
   - `[face]` An illness at {settlement} is tended with a family's own water, behind a door the family shuts. The town has no part in it.

**`Disasters & Famine`: NO reserves, hospital present**
1. `[ledger]` Against sickness {settlement} has somebody to send for. Against a bad harvest it has nothing put by at all.
   - `[face]` The care for the sick at {settlement} is a door to knock on. The town keeps no food against a bad harvest, and hunger has no door at all.
   - `[face]` No common store of grain stands at {settlement}, and a bad year is met house by house. A sickness is answered from outside the household; a bad year is not.
   - `[face]` Help for the sick is on the record at {settlement} and stored grain is not, so a failed crop falls to private hands and nowhere else.
2. `[street]` The town is better set against the sickness than against the hunger: a house with a fever knows where to go, and a house short of grain does not.
   - `[face]` Sickness here is somebody's work. Hunger has no store to open, and what is done about it is done indoors.
   - `[face]` A sickness here can be paid for. A bad year cannot, and what meets it is whatever the house has kept back.
   - `[face]` A fever in this town gets attended to. A bad harvest is met out of what the houses hold, and what the houses hold is not counted anywhere.
3. `[unfolding]` Everything {settlement} has against a sickness comes when it is called. Everything it has against a bad year sits in the houses, and none of it is held in common.
   - `[face]` The town is arranged against the sickness and not against the hunger, and what {settlement} would open in a hungry year is a question the record leaves standing.
   - `[face]` What {settlement} has against a sickness is skill that can be fetched. What it has against a bad harvest is not kept in any one place.
   - `[face]` Provision at {settlement} runs toward the sick and no further. Grain is not laid in, and a failed crop finds the town exactly as it stands.

**`Disasters & Famine`: NO reserves, NO medical provision**
1. `[ledger]` {settlement} holds no store in common against a bad year and gives no room over to the sick.
   - `[face]` The sum of what {settlement} has by it is nobody's to keep. No one is paid for sitting with the sick, and the sitting falls to the house.
   - `[face]` A store and a sick-house are each an office as much as a building, and no one at {settlement} holds either office.
   - `[face]` Whatever is put by at {settlement} against a hard year is put by behind somebody's own door, and the sick are nursed in their own beds.
2. `[street]` When the food runs short the asking starts at a neighbour's door, and when somebody falls ill the same door is knocked on. Neither has a door of its own.
   - `[face]` What stands in for a store here is knowing what a house would admit to holding, and what stands in for a sick-house is somebody's own room.
   - `[face]` Food reaching a house that runs short comes out of another house's own, and what is done for its sick comes out of somebody's working day. Both go on the count.
   - `[face]` Somebody who falls ill here stays in the room they sleep in, and the house goes on around them. Whatever that house puts by is in the same room.
3. `[visitor]` The answer a stranger gets at {settlement}, whether he asks after the store or after the sick-house, is a name and a door.
   - `[face]` A traveller taken ill at {settlement} becomes the business of whatever roof he is under. No room is set apart for him, and he has no claim on anybody's store.
   - `[face]` Every room a stranger passes at {settlement} has something in it, and not one of them is kept back against want or against a sickness.
   - `[face]` A stranger wanting food or a bed for somebody ill is sent to a household at {settlement}, and a household may ask what he brings, or may not want him under the roof.

---

