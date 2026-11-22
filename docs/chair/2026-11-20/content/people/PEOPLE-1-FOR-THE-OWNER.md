# For the owner: what PEOPLE-1 changed on the people cards (written 2026-11-20T21:09Z)

## What was wrong
Each person card has two lines about their place in the power structure:
- the line under their title (their place in the order: "Holds the seat…", "Commands those under arms…");
- the "Constraint:" line, which says what limits them.

Each kind of person had exactly ONE wording of each, so most towns, cities and metropolises printed the same sentences. On 150 places of each size, the commonest single sentence appeared in this share of places:

| | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| place in the order, before | 45% | 35% | 38% | 67% | 72% | 70% |
| place in the order, after | 11% | 12% | 11% | 17% | 22% | 22% |
| constraint, before | 46% | 35% | 38% | 73% | 92% | 89% |
| constraint, after | 12% | 11% | 13% | 18% | 15% | 18% |

The bar was "about 15%". What is still over it:
- **City and metropolis 22%:** this is the bare "Holds the seat." that a ruler who also heads a house prints, before the "Still the … as well." tail. The chair ruled it stays bare.
- **Town 18%:** a constraint line I did not pool, "Steady work earns no notice; getting ahead takes a crisis or a patron."
- **Metropolis 18%:** the faith's "The priests under it answer in name…". Three more wordings are owed by PEOPLE-2.

## How it works now (nothing invented)
- **Today's line stays.** It is still always one of the choices.
- **Every new wording states only what the place's record already holds:** a council, a market, a court, walls, a guild, its size, its wealth, what it sends out or buys in, or the person's own house. A wording is used only where its facts are true.
- **No new drama:** a calm place stays calm, and no line claims a feeling or a scheme the record does not hold.
- **The choice is not random.** It is keyed to the place's seed and the person, so a place always reads the same, and a saved town keeps the sentence it has.
- **Slots:** {export}, {import} and {house} are filled from the place's own record. A criminal or hidden house is never named, and a service such as "spellcasting" is never treated as a good.

Every filled sentence seen on 600 places is listed in `measures/b1b-fills.out.txt`.

## Every new sentence, beside the one it joins
## THE PLACE IN THE ORDER (a person's card, "structuralPosition")

### government · stable · dominant

TODAY, everywhere this row prints: "Holds the seat, and people accept it; there is room to act, not just to hold on."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Holds the seat with the council beside it; in quiet times the work is the ordinary business."  (needs: ruling body)
- "Holds the seat; the market days run and the dues come in."  (needs: market)
- "Holds the seat; quarrels that need judging go to the court."  (needs: court sits)
- "Holds the seat, and in a place this small everyone knows it; most quarrels end at its door."  (needs: population: small)
- "Holds the seat in good years; the place is comfortable, and the seat's costs are met."  (needs: prosperity: ≥ comfortable)
- "Holds the seat; there is enough coin for the everyday work, if little over."  (needs: prosperity: moderate)
- "Holds the seat while the place sends out {export} and coin comes back; there is room to act."  (needs: export good)
- "Holds the seat in a quiet season; there is time to act."

### military · stable · dominant

TODAY, everywhere this row prints: "Commands those under arms in quiet times; the work is keeping trouble from starting."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Commands {house} in quiet times: the drill, the roster and the gear kept ready."  (needs: own house)
- "Commands those under arms in quiet times; the walls are walked, and little more is asked."  (needs: walls)
- "Commands those under arms in quiet times; most days the work is the market crowds and the odd brawl."  (needs: market)
- "Commands those under arms in a large place at peace; the work is many small quarrels, not one big one."  (needs: population: large)
- "Keeps those under arms ready in a quiet season; nothing calls on them but routine."
- "Commands those under arms while the place is quiet; the work is the rounds, the roll and the pay."
- "Commands those under arms in quiet times; the hard part is keeping idle hands sharp."

### religious · stable · dominant

TODAY, everywhere this row prints: "Leads the faith in quiet times, whatever it thinks of the seat beside it."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Leads the faith from {house}; in quiet times the work is the services, the feast days and the burials."  (needs: own house)
- "Leads the faith across a large place, where its people are too many for one priest to know."  (needs: population: large, church)
- "Leads the faith in a small place, where the priest knows every family by name."  (needs: population: small, church)
- "Leads the faith in an ordinary year: services, feast days, weddings and burials."
- "Leads the faith while the place is at peace; the work is the round of services and the needs of the poor."
- "Leads the faith in a settled season, with no crisis to call the faithful together."

### economy · stable · subordinate (also: crafts · stable · subordinate)

TODAY, everywhere this row prints: "Runs a smaller house behind the leading one in quiet times."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Keeps {house} going in quiet times, a smaller house behind the leading one in the trade."  (needs: own house)
- "Runs a smaller house behind the leading one, in a place that sends out {export}."  (needs: export good)
- "Runs a smaller house in the trade, second to the leading one, in a steady season."
- "Runs one of the many smaller houses of a large place, behind the leading one in the trade."  (needs: population: large)
- "Runs a smaller house behind the leading one; it keeps its own regulars on market days."  (needs: market)
- "Runs a smaller house in the guild, behind the leading one, in a steady season."  (needs: guild)

### economy · stable · dominant (also: crafts · stable · dominant)

TODAY, everywhere this row prints: "Heads the leading house in the trade in quiet times; its hold is secure and its say is real."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Heads {house}, the leading house in the trade, in a steady season."  (needs: own house)
- "Heads the leading house in a trade that sends {export} out of the place."  (needs: export good)
- "Heads the leading house in the trade of a large place, with many smaller houses behind it."  (needs: population: large)
- "Heads the leading house in the trade while business is steady and no one presses it."

### government · stable · subordinate

TODAY, everywhere this row prints: "Holds an office that runs from day to day, with no crisis to answer."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Keeps {house} for the seat, day to day, with no crisis to answer."  (needs: own house)
- "Holds a post under the council; the work is the daily round, and the round is quiet."  (needs: ruling body)
- "Holds a small post of the seat and does its daily work; nothing out of the ordinary is asked of it."
- "Holds a post of the seat whose busiest days are market days."  (needs: market)
- "Holds a post of the seat in good years, when the work is steady and the purse sound."  (needs: prosperity: ≥ comfortable)

### magic · stable · dominant

TODAY, everywhere this row prints: "Heads the casters in quiet times; their place is secure and their spells are in demand."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Heads {house} in quiet times; the work is the ordinary run of spellwork."  (needs: own house)
- "Heads the casters of a large place, where there is call for spells every day."  (needs: population: large)
- "Heads the casters in good years, when people can afford to pay for spellwork."  (needs: prosperity: ≥ comfortable)
- "Heads the casters in a quiet season; the work is the ordinary run of charms and wards."

### other · stable · dominant (also: other · corruption · dominant, other · food_crisis · dominant, other · economic_stress · dominant, other · contested · dominant)

TODAY, everywhere this row prints: "Heads an old family while the seat's offices take up more of what the family once did."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Heads an old family whose name still opens doors here."
- "Heads an old family among many in a large place, where an old name opens doors but does not rule."  (needs: population: large)

### government · governance_fractured · dominant

TODAY, everywhere this row prints: "Holds the seat in name, but fewer people come when called, and some orders go unanswered."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Holds the seat, but the council no longer moves when it asks, and some orders go unanswered."  (needs: ruling body)
- "Holds the seat in name; in a place this small everyone sees who no longer comes when called."  (needs: population: small)
- "Holds the seat in name; when it calls the neighbours out, fewer come than used to."  (needs: militia)
- "Holds the seat, but its word now carries only as far as people choose to let it."

### government · economic_stress · dominant

TODAY, everywhere this row prints: "Holds the seat while money is short, and people judge the seat by what it can no longer pay for."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Holds the seat while money is short, in a place that lives on what it gets for its {export}."  (needs: export good)
- "Holds the seat while money is short, and {import} must still be bought in at whatever it costs."  (needs: import good)
- "Holds the seat in a small place gone short of coin, where everyone knows what has gone unpaid."  (needs: population: small)
- "Holds the seat while money is short, and every council meeting comes back to the same few coins."  (needs: ruling body)
- "Holds the seat in lean years, and every cost it asks is counted."

### religious · economic_stress · dominant

TODAY, everywhere this row prints: "Leads the faith while money is short; its lands and alms are both a help and a target."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Leads the faith from {house} while money is short, and more people come to its door for alms."  (needs: own house)
- "Leads the faith in a small place gone short of coin, where the priest knows which households are going without."  (needs: population: small, church)
- "Leads the faith through lean years, when people lean on it more and give it less."

### religious · governance_fractured · dominant

TODAY, everywhere this row prints: "Leads the faith while the seat fails, and people bring it the quarrels the seat no longer settles."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Leads the faith while the seat fails; more disputes now end at {house} than at the seat's door."  (needs: own house)
- "Leads the faith while fewer heed the seat, and more ask the faith to settle what the seat once did."

### religious · contested · dominant

TODAY, everywhere this row prints: "Leads the faith while many doubt the seat's right, and the seat wants its blessing."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Leads the faith from {house} while many doubt the seat's right; both sides listen for what is said there."  (needs: own house)
- "Leads the faith while the seat's right is in doubt, and people wait to hear which way it leans."

### government · contested · dominant

TODAY, everywhere this row prints: "Holds the seat, but many doubt its right to it, and the doubt has not gone away."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Holds the seat while many question its right, and the questions are asked openly."

## THE LIMIT OF THE POST (a person's card, "Constraint:")

### government · stable · dominant

TODAY, everywhere this row prints: "With nothing pressing, it is hard to win support for mending the weak spots before they break."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Cannot act alone: nothing is done here until the rest of the council agrees."  (needs: ruling body)
- "Does not set the prices or the wages of the trades; for anything touching them, the seat must deal with the guild."  (needs: guild)
- "Has no say over the church or its clergy; whatever the seat wants from the faith, it must ask for."  (needs: church)
- "There is coin for the everyday work and little over; any new building or hire means asking the households for more."  (needs: prosperity: moderate)
- "The coffers bear the everyday work and more, but every new cost must still be argued for before those who pay it."  (needs: prosperity: ≥ comfortable)
- "Has no paid hands to see its word kept; what the seat decides, the neighbours must be willing to carry out."  (needs: militia)
- "Its word is kept by the paid watch, and every extra round the watch walks comes out of the same purse."  (needs: paid watch, watch)
- "Rules by custom alone; a household that will not listen must be talked round, not made to."  (needs: ruler: elder, population: small)
- "Cannot push through anything the strongest power in the place sets itself against; here that power outweighs the seat."  (needs: seat outranked)
- "Needs the other powers of the place on its side for anything large; the seat leads, but not alone."  (needs: rival power)
- "Does not judge the hard cases itself; those go to the court, and the court decides them in its own way."  (needs: court sits)
- "Can set the market days and the tolls, but cannot make buyers come or sellers stay."  (needs: market)
- "In a place this large the seat sees little for itself; it must act on what its people bring it."  (needs: population: large)
- "Cannot please everyone at once; whatever the seat gives one side, another asks for next."

### military · stable · dominant

TODAY, everywhere this row prints: "It is hard to win the coin and the say that would be needed if worse trouble came."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Cannot raise more hands or more pay without the council, and in quiet years the council is careful with coin."  (needs: ruling body)
- "Must keep {house} fed and paid out of what the seat allows, and the seat allows what quiet years seem to need."  (needs: own house)
- "The walls want upkeep every year; the coin for it has to be asked for, and in quiet years it comes slowly."  (needs: walls)
- "The place can afford its guard, but while nothing threatens, every extra hand must be argued for."  (needs: prosperity: ≥ comfortable)
- "There is enough for the hands already under arms and little over; a larger force would mean new dues."  (needs: prosperity: moderate)
- "Much of its strength is neighbours who turn out when called, and they have fields and trades to get back to."  (needs: militia)
- "Hired companies are paid by the season, and keeping them on when nothing threatens is hard to argue for."  (needs: mercenary)
- "Answers to the seat for every hand and every coin; it cannot set its own numbers."
- "Must share the coin for keeping order with the paid watch, and it is the watch that people see every day."  (needs: paid watch, watch)
- "In a place this large, those under arms are spread thin across many streets."  (needs: population: large, tier: ≥ village)
- "Drill keeps hands ready but not keen; quiet years wear on discipline."

### religious · stable · dominant

TODAY, everywhere this row prints: "With nothing pressing, it is easy to grow comfortable and hard to argue for growing."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Keeping {house} in repair takes alms, and alms come slowly when nothing troubles people."  (needs: own house)
- "Does not rule here; whatever the faith wants of the council, it must ask for."  (needs: ruling body)
- "Has few hands to help; in a place this small most of the faith's work falls to one person."  (needs: population: small)
- "The priests under it answer in name, but each keeps their own flock and their own ways."  (needs: population: large, church)
- "The faithful give well in good years, but gifts come with the givers' wishes attached."  (needs: prosperity: ≥ comfortable)
- "Cannot command belief, only ask for it; what it has is what people choose to give."
- "The work is the same each week and each year, and doing it well earns thanks but little say."
- "Oaths and marriages are the faith's to bless, but quarrels over them go before the court."  (needs: court sits)
- "Must see to the faith's own people as well as its flock, and both expect the same patience."

### economy · stable · subordinate (also: crafts · stable · subordinate)

TODAY, everywhere this row prints: "Growing into the leading house's trade invites a reply; staying out of it means staying small."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "What {house} can take on is limited to what the leading house leaves alone."  (needs: own house)
- "The best of the {export} trade is already spoken for; the smaller houses take what is left."  (needs: export good)
- "Must keep to the guild's rules on prices and hands, rules the bigger houses had more say in writing."  (needs: guild)
- "Sells on the same market days as the leading house, and buyers go to the bigger name first."  (needs: market)
- "Has less coin than the bigger houses to wait on a slow buyer, so it takes smaller, quicker deals."
- "In good years there is custom enough for all, but the best of it goes to the leading house first."  (needs: prosperity: ≥ comfortable)
- "In a place this large there are many small houses after the same custom."  (needs: population: large)
- "Has little voice when the council sets the dues on trade; the leading house speaks first."  (needs: ruling body)

### economy · stable · dominant (also: crafts · stable · dominant)

TODAY, everywhere this row prints: "Every new privilege it gathers in plain sight draws the eye of the seat and of its rivals."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Does not set the dues on trade; the council does, and the council hears every house."  (needs: ruling body)
- "Lives on the place's trade in {export}; whatever cuts that trade cuts this house first."  (needs: export good)
- "Must buy in {import} like everyone else, at prices set somewhere else."  (needs: import good)
- "Being first in the trade means being the one every complaint about prices is brought to."
- "Must keep the smaller houses of the guild content; the guild's rules bind the leading house too."  (needs: guild)

### government · stable · subordinate

TODAY, everywhere this row prints: "Good work is expected and goes unnoticed; a mistake is remembered."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Runs {house} on what the seat allots it, and must ask before spending more."  (needs: own house)
- "Answers to the council for every coin and every choice; little is left to the post's own judgment."  (needs: ruling body)
- "Can do only what the seat has given the post to do; anything more must be asked for."
- "The purse is sound in good years, but every coin the post spends is counted by someone above it."  (needs: prosperity: ≥ comfortable)
- "Has enough to do the work and no more; there is nothing spare for doing it better."  (needs: prosperity: moderate)

### magic · stable · dominant

TODAY, everywhere this row prints: "In quiet times the seat slowly hems the casters in with rules; recognition comes with limits."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Must keep {house} paid for out of fees and patrons, and patrons want a say in the work."  (needs: own house)
- "Must answer to the council for what is cast within the place."  (needs: ruling body)
- "A spell gone wrong is remembered longer than a hundred done right; the casters' good name is always at stake."
- "Some people here will not buy a spell at any price, and no fair dealing changes their minds."

### other · stable · dominant (also: other · corruption · dominant, other · food_crisis · dominant, other · economic_stress · dominant, other · contested · dominant)

TODAY, everywhere this row prints: "The family's say slowly shrinks beside the offices that run things."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Has no seat on the council by right; what the family wants, it must win through friends there."  (needs: ruling body)
- "The old honours of {house} still stand, but the seat decides what those honours are worth."  (needs: own house)
- "Old rights count only as far as people still honour them, and fewer remember why they should."
- "The family's wealth is in land and name, and neither turns into coin quickly."  (needs: prosperity: ≥ comfortable)

### government · governance_fractured · dominant

TODAY, everywhere this row prints: "Cannot mend what is broken without bringing to light the quiet deals that keep the place running now."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Cannot get the council to agree on any remedy, and cannot act without it."  (needs: ruling body)
- "Has no paid hands to make its word stick; it must win people back one household at a time."  (needs: militia)
- "In a place this small, every attempt to take charge again is watched and talked over by everyone."  (needs: population: small)
- "Every order that goes unanswered makes the next one easier to ignore."

### government · economic_stress · dominant

TODAY, everywhere this row prints: "Cannot pay for the repairs and relief people want without coin the place does not have."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Every coin spent on the walls is a coin not spent on relief, and both are wanted."  (needs: walls)
- "Cannot raise the dues without the council, and the council knows the households cannot pay more."  (needs: ruling body)
- "Must still buy in {import}, and that comes first, before any repair or relief."  (needs: import good)
- "Can promise little and pay for less, and every refusal is remembered."

### religious · economic_stress · dominant

TODAY, everywhere this row prints: "Anything it does to guard its own wealth while people go short is seen by all."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Keeping {house} in repair and feeding the poor draw on the same thin purse."  (needs: own house)
- "Can give only what it is given, and in lean years less is given."
- "In a place this small, everyone knows who the alms went to and who went without."  (needs: population: small)
- "The church's roof and the poor box both want coin, and there is not enough for both."  (needs: church)

### religious · governance_fractured · dominant

TODAY, everywhere this row prints: "Whatever the faith takes on now, whoever next holds the seat firmly may resent and take back."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Has no hands to enforce anything it settles; its word holds only while people choose to keep it."
- "Every quarrel it settles is one the council failed to settle, and the council knows it."  (needs: ruling body)

### religious · contested · dominant

TODAY, everywhere this row prints: "The longer it waits to bless the seat, the less the blessing will be worth."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Whatever it says of the seat, part of the congregation will have hoped for the other answer."
- "The council wants its word on the seat; giving it, or holding it back, both cost the faith friends."  (needs: ruling body)

### government · contested · dominant

TODAY, everywhere this row prints: "Every hard move gives the doubters a new reason; every delay lets the doubt grow."

NOW ALSO, where the record holds what each needs (today's line stays one of the choices):
- "Cannot carry the council on anything hard while so many doubt the seat's right."  (needs: ruling body)
- "Must answer for every choice twice: once to those who back the seat, once to those who doubt it."

