# W2-WRITE — every new or changed corpus line, for the owner's veto

Base: 202e58953 + W2-A-LEAVES 96d698de7 (no writing). Tip: the lane. NEW = a line written here; CHANGED = a line whose declaration (or, once, text) moved. Each new line's case is in the hand-back's stage tables.

**DS-ECO-2::GRANARY: thin**
- CHANGED v3 `[colour]` -> `[institution: granary]`

**DS-ECO-6::TIER: significant off-book activity (≥15)**
- NEW v4 `[colour]` Goods change hands at {settlement} without anyone writing them down, and the price a buyer is quoted depends on whether a duty is to be paid at all.
- NEW v5 `[colour]` The duties gathered at {settlement} fall short of the trade that plainly goes on there, and nobody is pressed to make up the difference.
- NEW v6 `[colour]` Ask how to bring goods into {settlement} cheaply and somebody will tell you, with a nod toward the quieter way in.

**DS-ECO-8::FOOD AND PROSPERITY: full stores lift the town**
- CHANGED v1 `[colour]` -> `[institution: granary]`
- CHANGED v2 `[colour]` -> `[institution: granary]`
- CHANGED v3 `[colour]` -> `[institution: granary]`
- NEW v4 `[colour]` {settlement} grows more food than it eats, and what it sells of the surplus brings coin in every season.
- NEW v5 `[colour]` A lean month at {settlement} is something people talk about, not something they live through, and the full larders are part of why the place does well.
- NEW v6 `[colour]` {settlement}'s good fortune rests partly on its harvests: so long as they come in full, the place can afford to be generous.

**DS-ECO-12::INCOME WEIGHT: the religious houses**
- CHANGED v1 `[colour]` -> `[sacredHouse]`
- CHANGED v2 `[colour]` -> `[sacredHouse]`
- NEW v3 `[no sacredHouse]` Faith carries real weight in {settlement}'s money, though the place keeps no house for it: what its people give for their faith leaves with them on the feast days.
- NEW v4 `[no sacredHouse]` At {settlement} the feast days set the calendar of buying and selling, and the offerings leave the place with the people who carry them.
- NEW v5 `[no sacredHouse]` {settlement} spends on its faith without keeping a house for it, so a quarrel over the rites would be felt in its money first.

**DS-DEF-2::Disasters & Famine: granary AND hospital**
- CHANGED v2 `[]` -> `[institution: granary]`

**DS-DEF-2::Disasters & Famine: NO reserves, NO medical provision**
- CHANGED v3 `[]` -> `[no institution: granary]`

**DS-DEF-3::COMPOUND: insurgency**
- CHANGED v1 `[guardPresence]` -> `[guardPresence · population: ≥ middling]`
- CHANGED v3 `[colour]` -> `[population: ≥ middling]`
- NEW v4 `[colour]` People at {settlement} keep to their own doorways after dark, and nobody goes to the far end of the place without a reason.
- NEW v5 `[guardPresence]` Those who keep order at {settlement} walk in pairs now, and there are lanes they no longer walk at all.

**DS-DEF-3::COMPOUND: political fracture** (pool brace: {"colour":true} -> {})
- CHANGED v1 `[]` -> `[population: ≥ middling]`
- CHANGED v2 `[]` -> `[colour]`
- CHANGED v3 `[]` -> `[population: ≥ middling]`
- NEW v4 `[colour]` At {settlement} a quarrel is settled by whichever power the quarrelling households look to, and the answers seldom match.
- NEW v5 `[colour]` What counts as an offence at {settlement} depends on who is asked, because each power keeps its own rules and enforces them on its own people.

**DS-DEF-6::Logistics & Supply: Granary + port**
- CHANGED v1 `[crisis: any]` -> `[institution: granary · coast · crisis: any]`

**DS-DEF-6::Logistics & Supply: Granary in isolation**
- CHANGED v1 `[]` -> `[institution: granary]`

**DS-DEF-6::Logistics & Supply: Granary with road supply**
- CHANGED v1 `[colour]` -> `[institution: granary]`
- CHANGED v3 `[no crisis: hunger]` -> `[institution: granary · no crisis: hunger]`

**DS-DEF-6::Naval Defense: Naval force**
- CHANGED v2 `[crisis: any]` -> `[coast · crisis: any]`

**DS-DEF-6::Naval Defense: Under blockade**
- CHANGED v1 `[colour]` -> `[coast]`
- CHANGED v2 `[colour]` -> `[coast]`

**DS-DEF-9::magicDependency false**
- CHANGED v3 `[colour]` -> `[colour]` · text: "The town would go on if the arcane went away, more slowly and less comfortably and go on." -> "The town would go on if the arcane went away, more slowly and less comfortably."

**DS-GEN-3::scores.military: CRITICAL**
- NEW v4 `[walls · crisis: any]` {settlement} has walls and too few people to stand on them; anyone determined would find a stretch that nobody watches.
- NEW v5 `[walls · crisis: any]` {settlement}'s walls are better than the muster behind them, and the muster is almost nothing.
- NEW v6 `[crisis: threat]` With trouble close, people in {settlement} know there is nobody to send against it, and they keep their own doors barred.

**DS-GEN-3::defenseProfile.readiness.label: Undefended**
- NEW v3 `[walls · militia · no garrison]` {settlement} has walls and a militia to stand on them, and neither would hold against anyone who came in earnest.
- NEW v4 `[walls · no garrison]` The walls at {settlement} stand with no paid force behind them, and walls nobody holds are only a fence.
- NEW v5 `[militia · no garrison]` {settlement} counts on its neighbours turning out with whatever they own, and everyone knows how little that would stop.

**DS-GEN-5::river** (pool brace: {"declares":["river"]} -> {})
- CHANGED v1 `[]` -> `[river]`
- CHANGED v2 `[]` -> `[river]`
- CHANGED v3 `[]` -> `[river]`
- CHANGED v4 `[]` -> `[river]`
- NEW v5 `[coast]` {settlement} stands where a river comes down to the sea, and its boats work the river more than the coast.
- NEW v6 `[coast]` In {settlement} the talk is of the river's moods more than the sea's, though the salt gets into everything.
- NEW v7 `[coast]` What {settlement} trades comes and goes by the river; the sea at its back carries less of it.

**DS-GEN-6::river** (pool brace: {"declares":["river"]} -> {})
- CHANGED v1 `[no deficit]` -> `[no deficit · river]`
- CHANGED v2 `[no deficit]` -> `[no deficit · river]`
- CHANGED v3 `[deficit]` -> `[deficit · river]`
- CHANGED v4 `[deficit]` -> `[deficit · river]`
- NEW v5 `[no deficit · coast]` {settlement} stands at a river's mouth because goods could go up the river and out to sea from the same landing.
- NEW v6 `[no deficit · coast]` {settlement} was put where the river meets the sea, and it has lived off both waters since.
- NEW v7 `[no deficit · coast]` {settlement} began as a landing at the river's mouth, and the landing is still the reason for the place.
- NEW v8 `[deficit · coast]` {settlement}'s ground gives less than it needs, and what the river brings down and the sea brings in makes up the rest.
- NEW v9 `[deficit · coast]` {settlement} has few fields between the river and the sea, and it eats from the boats.
- NEW v10 `[deficit · coast]` Bread in {settlement} comes down the river or in from the sea, because the ground at the mouth was never good for grain.

**DS-GEN-7::power_stress: occupation against stated stability**
- CHANGED v1 `[no crisis: unrest]` -> `[crisis: occupied · no crisis: unrest]`
- CHANGED v3 `[no crisis: unrest]` -> `[crisis: occupied · no crisis: unrest]`

**DS-GEN-9::event type: disaster**
- NEW v5 `[]` {event} is written into {settlement}'s rolls as a loss, with the damage set down item by item.
- NEW v6 `[]` People in {settlement} speak of {event} plainly, as a hard thing that happened to the place and was got through.
- NEW v7 `[]` The telling of {event} at {settlement} carries the names of those who dealt with it, handed down with care.

**DS-GEN-9::event type: political**
- NEW v5 `[]` {settlement}'s rolls mark {event} as a turn in how the place is governed, and the entry is {timeband_age}.
- NEW v6 `[]` Ask about {event} in {settlement} and you hear the hall's account first and the street's second, and the two do not quite agree.
- NEW v7 `[]` The older families of {settlement} know who stood on which side of {event}, and they tell it as a story about the hall, not about themselves.

**DS-GEN-9::event type: economic**
- NEW v5 `[colour]` {event} sits in {settlement}'s accounts as a turn in its fortunes, {timeband_age} and plainly entered.
- NEW v6 `[colour]` People in {settlement} argue over whether {event} left the place richer or poorer, and each side has a story to prove it.
- NEW v7 `[colour]` The older heads of {settlement} measure good years and bad against {event}, a turn in its trade that everyone there has heard of.

**DS-GEN-9::event type: religious**
- NEW v5 `[colour]` {settlement}'s rolls set down {event} as a matter of faith, between the harvests and the deaths.
- NEW v6 `[colour]` In {settlement}, {event} is spoken of in a lowered voice, by believers and doubters alike.
- NEW v7 `[colour]` The elders of {settlement} tell {event} as a test of the faith the place keeps, and they tell it with care.

**DS-GEN-9::event type: magical**
- NEW v5 `[]` {settlement}'s rolls note {event} in plainer words than the people use when they tell it.
- NEW v6 `[]` Every child in {settlement} has heard of {event}, and most have been told a different version of it.
- NEW v7 `[]` {settlement} keeps the story of {event} close, the way a place keeps a thing it does not fully understand.

**DS-GEN-9::event type: demographic**
- NEW v5 `[]` The count of households at {settlement} changed with {event}, and the rolls say so in plain figures.
- NEW v6 `[]` Families in {settlement} know which of them were here before {event} and which came or stayed after it.
- NEW v7 `[]` {event} is told at {settlement} as a year when people came and went in numbers.

**DS-GEN-9::event type: exile_return**
- NEW v5 `[]` {event} is in {settlement}'s rolls as a sending-away and a coming-back, and the rolls do not say who was in the right.
- NEW v6 `[]` In {settlement}, everyone knows which families left and came back at {event}, and which never left.
- NEW v7 `[]` {event} is {timeband_age}, and {settlement} tells it as a family quarrel that grew too large for the families.

**DS-GEN-9::event type: occupation_infiltration**
- NEW v5 `[]` {settlement}'s rolls carry {event}, when a power from outside reached into the running of the place.
- NEW v6 `[]` {event} is talked of quietly in {settlement}, and only among people who know each other well.
- NEW v7 `[]` A visitor who asks about {event} in {settlement} gets a short answer and a change of subject.

**DS-POW-5::FLAG: crimeIsGovt**
- CHANGED v1 `[colour]` -> `[no guardPresence]`
- NEW v4 `[guardPresence]` {settlement} has people paid to keep order, and they keep the order the gang bosses want; a complaint against the bosses goes nowhere.

**DS-POW-6::GM ADVISORY: the commander is a political actor**
- NEW v3 `[dm-only · colour]` {faction} answers to the {seat} at {settlement} in name only: whatever the {seat} plans needs its consent, and that consent is bargained for.
- NEW v4 `[dm-only · colour]` At {settlement} the {seat} gives no order {faction} would refuse, and whoever can turn {faction} turns the place's armed strength with it.
- NEW v5 `[dm-only · colour]` {faction} has grown stronger than the {seat} at {settlement}, and both know it; the {seat} keeps the title while {faction} decides what is enforced.

**DS-STR-1::UNDER OCCUPATION**
- CHANGED v2 `[]` -> `[crisis: occupied]`
- CHANGED v3 `[walls]` -> `[walls · garrison]`
- CHANGED v6 `[]` -> `[crisis: occupied]`
- CHANGED v7 `[no walls]` -> `[no walls · crisis: occupied]`

**DS-STR-1::WARTIME**
- CHANGED v4 `[]` -> `[crisis: wartime]`

**DS-FTH-4::FLAG: heresySuppression: hunted**
- NEW v3 `[colour]` Anyone at {settlement} suspected of working magic is named aloud and shunned, and those who have the art keep it even from their kin.
- NEW v4 `[colour]` A charm worked in the open at {settlement} is reported before nightfall, and the faithful see to it that whoever worked it leaves.
- NEW v5 `[colour]` The faithful of {settlement} treat magic as heresy and hunt it as such: a suspicion is enough to bring the neighbours to the door.

**DS-FTH-4::FLAG: heresySuppression: preached**
- NEW v3 `[colour]` Most people at {settlement} hold that magic offends the faith, and a neighbour who works it is talked about, though not yet turned in.
- NEW v4 `[colour]` Children at {settlement} are taught that spellwork is heresy, and they learn to look away from anyone who does it.
- NEW v5 `[colour]` A newcomer at {settlement} soon hears that magic is heresy here, and is watched until the neighbours are sure of them.
