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
1. `[ledger]` The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly.
2. `[street]` Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual.
3. `[unfolding]` What {settlement} has built is holding against the pressure and is being spent doing it; the posture is survivable, and survivable is the most that can be said of it here.

**`Beasts & Monsters`: `plagued`, perimeter but NO force to hold it**
1. `[ledger]` {settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night.
2. `[visitor]` A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal.
3. `[unfolding]` The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed.

**`Beasts & Monsters`: `plagued`, NO perimeter and NO force**
1. `[ledger]` An embattled country and nothing organized standing in it: {settlement} has no line, no force and no specialist recourse, and survival here rests on terrain, distance and the ability to leave.
2. `[street]` The town does not defend itself. What it does is watch, and move, and hope the pressure goes around it, and that is understood by everyone in it.
3. `[visitor]` A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place is arranged as though danger were expected to be met.

**`Beasts & Monsters`: `frontier`, credible deterrence**
1. `[ledger]` {settlement} sits on an active frontier with a line and a force behind it. Most of what comes out of the country will not press a defended perimeter, and most of what comes here does not.
2. `[street]` The town takes the frontier seriously and has taken it seriously long enough that the arrangements are ordinary rather than anxious.
3. `[counterforce]` Very little reaches {settlement} out of the wild country, and the reason is that the arrangements are visible from a long way off.

**`Beasts & Monsters`: `frontier`, force without a perimeter**
1. `[ledger]` {settlement} keeps armed people on an open frontier, which means the defense is reactive: whatever comes chooses where the fighting happens, and the town arrives afterwards.
2. `[visitor]` A stranger finds soldiers at {settlement} and no wall for them to stand on, and can see how that would go against anything that arrived in more than one place.
3. `[street]` The town can answer trouble and cannot prevent it, and the difference costs it something every season.

**`Beasts & Monsters`: `settled`, defenses beyond the need**
1. `[counterforce]` There is very little in the country around {settlement} and there are substantial works facing it; whatever the walls here are for, it is not the creatures.
2. `[ledger]` {settlement} is comfortably over-provided against beasts. The pressures that matter to this town are internal, and its defensive spending does not reflect that.
3. `[visitor]` A stranger notices the perimeter at {settlement} chiefly for how relaxed the people on it are.

**`Beasts & Monsters`: `settled`, nothing organized**
1. `[ledger]` {settlement} keeps no organized defense against the country, and in a heartland this quiet the arrangement is a reasonable one rather than a gap.
2. `[street]` The town has never needed to think about what is outside it, and does not.
3. `[visitor]` A stranger walks out of {settlement} in any direction at any hour and meets nothing that would justify a watch.

**`Invasion & War`: walls AND professional garrison**
1. `[ledger]` {settlement} has a line and professionals to hold it, which is real deterrence against raiding and against a conventional assault; it is not a posture rated for a long siege without stores behind it.
2. `[visitor]` A stranger sizing {settlement} up sees the two things that matter together (the wall and the men who belong to it) and revises what an attempt would cost.
3. `[street]` The town believes it could be held, and the belief is founded on something rather than on hope.

**`Invasion & War`: walls with citizen militia**
1. `[ledger]` Walls at {settlement} with townspeople behind them: credible against raiders, and inadequate against anybody who arrives professionally and brought siege gear.
2. `[street]` The town would turn out and does not pretend that turning out is the same as being defended.
3. `[unfolding]` What {settlement} has would hold against the first thing and is unlikely to hold against the second, and nothing in hand changes that.

**`Invasion & War`: walls with NO force**
1. `[ledger]` {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else.
2. `[visitor]` A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it.
3. `[street]` The town has the thing that would save it and not the people who would use it, and says so when pressed.

**`Invasion & War`: force with NO walls**
1. `[ledger]` {settlement} keeps a professional force and no perimeter. It answers raiders well and cannot hold a siege, because there is nothing here to hold.
2. `[street]` The town's defense is people rather than works, and people can be gone around.
3. `[visitor]` A stranger sees soldiers at {settlement} and no line for them to stand behind, and can see how that decides where any fight would happen.

**`Invasion & War`: militia only**
1. `[ledger]` {settlement} can put armed citizens on their own ground, which counts for something against a disorganized raid and for nothing at all against a disciplined force.
2. `[street]` The town knows its own country and knows that knowing it is not an answer to a professional army.
3. `[visitor]` A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody.

**`Invasion & War`: neither walls nor force**
1. `[ledger]` {settlement} has no line and no force. Organized aggression cannot be resisted here; what preserves the town is distance, diplomacy, or being beneath notice.
2. `[counterforce]` Nothing has come for {settlement} and nothing about the town would stop it. The safety here is entirely a matter of nobody having wanted to.
3. `[street]` The town's plan for an army is to not be interesting to one, and everybody here can state the plan.

**`Internal Security`: full legal chain (court AND prison)**
1. `[ledger]` {settlement} can arrest, try and hold, and having all three means the town's law is a process rather than a threat.
2. `[street]` A thing done wrong at {settlement} goes somewhere and takes time, and the town has come to rely on that rather than on the watch's temper.
3. `[visitor]` A stranger who brings a complaint at {settlement} is given a procedure rather than a favour, and the procedure runs.

**`Internal Security`: court without detention**
1. `[ledger]` {settlement} tries offences it cannot hold anyone for; the sentences available here are money and exile, and both of them fall unevenly.
2. `[street]` The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road.
3. `[unfolding]` Each judgment {settlement} cannot enforce costs the next one a little of its weight, and the town's courts are spending down a reputation they cannot replace.

**`Internal Security`: detention without process**
1. `[ledger]` {settlement} can hold people and has no settled way of deciding whether it should, which makes enforcement here a matter of who is doing it.
2. `[visitor]` A stranger at {settlement} is careful in a way he would not need to be in a town with courts, and cannot say precisely why.
3. `[street]` The town can put a person away at {settlement} and cannot say on what grounds, and has learned not to ask on whose.

**`Internal Security`: no legal infrastructure**
1. `[ledger]` There is no legal machinery at {settlement}; order here rests on force alone, and force alone deters only while it is present.
2. `[street]` The town settles things itself, quickly, and does not always settle them well.
3. `[visitor]` A stranger wronged at {settlement} discovers there is nowhere to take it, and that the discovery surprises nobody local.

**`Economic Survival`: `STRONG`**
1. `[ledger]` {settlement} can absorb a sustained crisis out of its own revenue: emergency measures can be paid for and the garrison can be kept paid while they last.
2. `[street]` The town could go through a bad season with its arrangements intact, and the people who would have to be paid through one know it.
3. `[counterforce]` Trouble at {settlement} has not turned into a collapse, and the reason is money. A town that can pay through a crisis mostly does.

**`Economic Survival`: `ADEQUATE`**
1. `[ledger]` {settlement} can fund a short crisis. A long one begins eating reserves within a few months, and the reserves are not deep enough to hide that from anybody.
2. `[unfolding]` The town's capacity to pay for its own emergencies is real and finite, and every season of pressure moves the finite part closer.
3. `[threshold]` {settlement} can pay for a crisis of the ordinary length; the edge of what it can fund lies a few months past the beginning of one, and the town has not been asked to find out where.

**`Economic Survival`: `WEAK`**
1. `[ledger]` Chronic shortfall at {settlement} limits what the town can do in an emergency before the emergency starts; the pay is irregular, and irregular pay shows up as morale exactly when it matters.
2. `[street]` The people who would have to hold {settlement} through something are already owed, and they have not forgotten it.
3. `[unfolding]` The shortfall at {settlement} is chronic rather than sudden, and each season of it removes a little more of what the town could do about a crisis when one comes.

**`Economic Survival`: `CRITICAL`**
1. `[ledger]` {settlement} cannot fund a response to anything. Any sustained pressure exhausts the town's capacity almost immediately and then continues.
2. `[unfolding]` The town is not spending its way out of trouble because there is nothing to spend, and each thing that goes wrong makes the next thing cheaper to happen.
3. `[street]` The town could not pay for a bad month at {settlement}, and the people who would have to be paid know it.

**`Disasters & Famine`: granary AND hospital**
1. `[ledger]` {settlement} holds food against a bad year and has somewhere to put the sick; between them the town can take a failed harvest or an outbreak without either becoming a catastrophe.
2. `[street]` The town has a place for grain and a place for the ill, and knows exactly what having both is worth.
3. `[counterforce]` Neither a failed harvest nor an outbreak turns into a catastrophe at {settlement}, and the reason is in the two buildings rather than in the luck.

**`Disasters & Famine`: granary AND parish care only**
1. `[ledger]` There is food stored at {settlement} and there are clergy who tend the sick: reserves against hunger, and against disease something better than nothing and well short of a hospital.
2. `[street]` The town can eat through a bad year. What it does about a plague is pray and nurse, in that order.
3. `[visitor]` A stranger finds a full store and a modest infirmary at {settlement}, and can see which of the two the town has spent its thinking on.

**`Disasters & Famine`: granary, NO medical provision**
1. `[ledger]` {settlement} can feed itself through a failed harvest and has nothing at all against disease; a sickness here spreads until it stops of its own accord.
2. `[unfolding]` The stores will carry the town through hunger. Nothing here will carry it through a plague, and the town has not built anything that would.
3. `[street]` The town can outlast a hungry year at {settlement} and has no answer at all to a sick one, and knows which of the two it fears.

**`Disasters & Famine`: NO reserves, hospital present**
1. `[ledger]` {settlement} can treat and contain an outbreak and keeps no food against a bad harvest; a crop failure here becomes hardship the same season it happens.
2. `[street]` The town is better prepared for the sickness than for the hunger, which is an unusual way round and does not comfort anyone.
3. `[unfolding]` {settlement} is arranged against the sickness it has seen and not against the hunger it has not, and nothing in hand is correcting the imbalance.

**`Disasters & Famine`: NO reserves, NO medical provision**
1. `[ledger]` {settlement} holds no food against a bad year and has nobody to treat the sick; a failed harvest is immediate hardship here and a plague runs until it burns out.
2. `[street]` The town's answer to a bad season is the same as its answer to a sickness, which is to endure it and count afterwards.
3. `[visitor]` A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither.

---

