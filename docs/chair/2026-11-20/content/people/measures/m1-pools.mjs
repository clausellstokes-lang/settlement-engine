// PEOPLE-1 seat M1 (2026-11-20): THE PROPOSED POOLS for `npcs[].activeConstraint` and `npcs[].structuralPosition`, as the
// measure applies them (m1-npcStructure.mjs). A PROPOSAL, not code: in src/ these would live in one new data file
// (`src/data/npcStructureVariants.js`, the name the proposal gives), each pool keyed by the writer's own `T` key.
//
// Each wording: { text, needs, excludes }. `needs` / `excludes` are atoms of the vocabulary
// (`src/domain/facts/factVocabulary.js`, read-only by the chair's rule of 16:10 UTC) EXCEPT the three marked `ATOM?` — facts
// the record holds that no atom answers today; the proposal lists them in its section 6 and the measure projects twice, with
// and without the wordings that need them ("B" and "B-vocab").
// Index 0 of every pool is today's exact line ('@today'), needs nothing. Every wording of a `stable` pool inherits the row's
// own declaration (`excludes: crisis`, CALM_ONLY); the `other` pools serve the four crisis keys too and claim no calm.
// Slots: {house} the card's own house (its `institution`, kind 'house', through people/goals.js :: houseFill);
// {export} the place's first export that is goods (factsOf.exports, through goals.js :: resourceFill); {import} likewise.

const T0 = Object.freeze({ text: '@today', needs: [] });
const w = (text, needs = [], excludes = []) => Object.freeze({ text, needs, excludes });
export const PENDING_ATOMS = Object.freeze(['ATOM? own house', 'ATOM? export good', 'ATOM? import good']);

// ── the atom reader over the cached facts (the measure's stand-in for factVocabulary's readers; see APPROXIMATIONS) ─────────
export function atomHolds(atom, ctx) {
  const F = ctx.place.facts;
  switch (atom) {
    case 'ruling body': return F.rulingBody === true;
    case 'seat members': return F.seatMembers === true;
    case 'ruler: elder': return F.rulerKind === 'elder';
    case 'ruler: priest': return F.rulerKind === 'priest';
    case 'guild': return !!F.guild;
    case 'market': return !!F.market;
    case 'walls': return !!F.walls;
    case 'watch': return !!F.watch;
    case 'paid watch': return !!F.paidWatch;
    case 'militia': return !!F.militia;
    case 'garrison': return !!F.garrison;
    case 'mercenary': return !!F.mercenary;
    case 'court sits': return !!F.courtSits;
    case 'rival power': return !!F.rivalPower;
    case 'seat outranked': return !!F.seatOutranked;
    case 'church': return !!F.hasChurch;
    case 'population: small': return F.populationBand === 'small';
    case 'population: large': return F.populationBand === 'large';
    case 'prosperity: moderate': return F.prosperity === 'moderate';
    case 'prosperity: ≥ comfortable': return ['comfortable', 'prosperous', 'wealthy'].includes(F.prosperity);
    case 'ATOM? own house': return !!ctx.house;
    case 'ATOM? export good': return !!ctx.export;
    case 'ATOM? import good': return !!ctx.import;
    default: throw new Error(`m1-pools: no reader for atom '${atom}'`);
  }
}

export function contextOf(place, card, { houseFill, resourceFill }) {
  const house = card.inst?.kind === 'house' && card.inst?.key ? houseFill(card.inst.key) : '';
  const firstGood = (list) => { for (const x of list || []) { const g = resourceFill(x); if (g) return g; } return ''; };
  return { place, card, house, export: firstGood(place.facts.exports), import: firstGood(place.facts.imports) };
}

const H = 'ATOM? own house', X = 'ATOM? export good', I = 'ATOM? import good';

// ── activeConstraint ──────────────────────────────────────────────────────────────────────────────────────────────────────
export const CONSTRAINT_POOLS = {
  // the seat's holder in a calm place: a plain limit of the office, read from who shares the seat and what the place has
  government__stable__dominant: [T0,
    w('Cannot act alone: whatever the seat wants done, the council must agree to first.', ['ruling body']),
    w('Does not set the prices or the wages of the trades; for anything touching them, the seat must deal with the guild.', ['guild']),
    w('Has no say over the church or its clergy; whatever the seat wants from the faith, it must ask for.', ['church'], ['ruler: priest']),
    w('There is coin for the everyday work and little over; any new building or hire means asking the households for more.', ['prosperity: moderate']),
    w('The coffers bear the everyday work and more, but every new cost must still be argued for before those who pay it.', ['prosperity: ≥ comfortable']),
    w('Has no paid hands to see its word kept; what the seat decides, the neighbours must be willing to carry out.', ['militia'], ['paid watch']),
    w('Its word is kept by the paid watch, and every extra round the watch walks comes out of the same purse.', ['paid watch']),
    w('Rules by custom, with no written law behind it; a household that will not listen must be talked round, not made to.', ['ruler: elder', 'population: small']),
    w('Cannot push through anything the strongest power in the place sets itself against; here that power outweighs the seat.', ['seat outranked']),
    w('Needs the other powers of the place on its side for anything large; the seat leads, but not alone.', ['rival power'], ['seat outranked']),
    w('Does not judge the hard cases itself; those go to the court, and the seat abides by what is decided there.', ['court sits']),
    w('Can set the market days and the tolls, but cannot make buyers come or sellers stay.', ['market']),
    w('In a place this large the seat sees little for itself; it must act on what its people bring it.', ['population: large']),
    w('Cannot please every quarter at once; whatever the seat gives one, another asks for next.'),
  ],
  military__stable__dominant: [T0,
    w('Cannot raise more hands or more pay without the council, and in quiet years the council is careful with coin.', ['ruling body']),
    w('Must keep {house} fed and paid out of what the seat allows, and the seat allows what quiet years seem to need.', [H]),
    w('The walls want upkeep every year; the coin for it has to be asked for, and in quiet years it comes slowly.', ['walls']),
    w('The place can afford its guard, but while nothing threatens, every extra hand must be argued for.', ['prosperity: ≥ comfortable']),
    w('There is pay for the hands already sworn and little over; a larger force would mean new dues.', ['prosperity: moderate']),
    w('Much of its strength is neighbours who turn out when called, and they have fields and trades to get back to.', ['militia'], ['paid watch']),
    w('Hired companies are paid by the season, and keeping them on when nothing threatens is hard to argue for.', ['mercenary']),
    w('Answers to the seat for every hand and every coin; it cannot set its own numbers.'),
    w('Must share the coin for keeping order with the paid watch, and it is the watch that people see every day.', ['paid watch']),
    w('In a place this large, those under arms are spread thin across many streets.', ['population: large']),
    w('Drill keeps hands ready but not keen; quiet years wear on discipline.'),
  ],
  religious__stable__dominant: [T0,
    w('Keeping {house} in repair takes alms, and alms come slowly when nothing troubles people.', [H]),
    w('Has no voice on the council; whatever the faith wants of the seat, it must ask for.', ['ruling body'], ['ruler: priest']),
    w('Has few hands to help; in a place this small most of the faith\'s work falls to one person.', ['population: small']),
    w('Many houses of worship answer to it in name, but each priest keeps their own flock and their own ways.', ['population: large', 'church']),
    w('The faithful give well in good years, but gifts come with the givers\' wishes attached.', ['prosperity: ≥ comfortable']),
    w('Cannot command belief, only ask for it; people come to the services as habit and the year bring them.'),
    w('The work is the same each week and each year, and doing it well earns thanks but little say.'),
    w('Oaths and marriages are the faith\'s to bless, but quarrels over them go before the court.', ['court sits']),
    w('Must see to the faith\'s own people as well as its flock, and both expect the same patience.'),
  ],
  economy__stable__subordinate: [T0,
    w('What {house} can take on is limited to what the leading house leaves alone.', [H]),
    w('The best of the {export} trade is already spoken for; the smaller houses take what is left.', [X]),
    w('Must keep to the guild\'s rules on prices and hands, rules the bigger houses had more say in writing.', ['guild']),
    w('Sells on the same market days as the leading house, and buyers go to the bigger name first.', ['market']),
    w('Has less coin than the bigger houses to wait on a slow buyer, so it takes smaller, quicker deals.'),
    w('In good years there is custom enough for all, but the best of it goes to the leading house first.', ['prosperity: ≥ comfortable']),
    w('In a place this large there are many small houses after the same custom.', ['population: large']),
    w('Has little voice when the council sets the dues on trade; the leading house speaks first.', ['ruling body']),
  ],
  economy__stable__dominant: [T0,
    w('Does not set the dues on trade; the council does, and the council hears every house.', ['ruling body']),
    w('Lives on the {export} that goes out; whatever cuts that trade cuts this house first.', [X]),
    w('Must buy in {import} like everyone else, at prices set somewhere else.', [I]),
    w('Being first in the trade means being the one every complaint about prices is brought to.'),
    w('Must keep the smaller houses of the guild content; the guild\'s rules bind the leading house too.', ['guild']),
  ],
  government__stable__subordinate: [T0,
    w('Runs {house} on what the seat allots it, and must ask before spending more.', [H]),
    w('Answers to the council for every coin and every choice; little is left to the post\'s own judgment.', ['ruling body']),
    w('Can do only what the seat has given the post to do; anything more must be asked for.'),
    w('The purse is sound in good years, but every coin the post spends is counted by someone above it.', ['prosperity: ≥ comfortable']),
    w('Has enough to do the work and no more; there is nothing spare for doing it better.', ['prosperity: moderate']),
  ],
  magic__stable__dominant: [T0,
    w('Must keep {house} paid for out of fees and patrons, and patrons want a say in the work.', [H]),
    w('Must answer to the council for what is cast within the place.', ['ruling body']),
    w('A spell gone wrong is remembered longer than a hundred done right; the casters\' good name is always at stake.'),
    w('The faithful watch what the casters do, and some will not buy a spell at any price.', ['church']),
  ],
  other__stable__dominant: [T0,
    w('Has no seat on the council by right; what the family wants, it must win through friends there.', ['ruling body']),
    w('{house} keep their old honours, but the seat decides what those honours are worth.', [H]),
    w('Old rights count only as far as people still honour them, and fewer remember why they should.'),
    w('The family\'s wealth is in land and name, and neither turns into coin quickly.', ['prosperity: ≥ comfortable']),
  ],
  // the small places' crisis rows (already a trouble the record names: the variants change the vantage, never the weight)
  government__governance_fractured__dominant: [T0,
    w('Cannot get the council to agree on any remedy, and cannot act without it.', ['ruling body']),
    w('Has no paid hands to make its word stick; it must win people back one household at a time.', ['militia'], ['paid watch']),
    w('In a place this small, every attempt to take charge again is watched and talked over by everyone.', ['population: small']),
    w('Every order that goes unanswered makes the next one easier to ignore.'),
  ],
  government__economic_stress__dominant: [T0,
    w('Every coin spent on the walls is a coin not spent on relief, and both are wanted.', ['walls']),
    w('Cannot raise the dues without the council, and the council knows the households cannot pay more.', ['ruling body']),
    w('Must still buy in {import}, and that comes first, before any repair or relief.', [I]),
    w('Can promise little and pay for less, and every refusal is remembered.'),
  ],
  religious__economic_stress__dominant: [T0,
    w('Keeping {house} in repair and feeding the poor draw on the same thin purse.', [H]),
    w('Can give only what it is given, and in lean years less is given.'),
    w('In a place this small, everyone knows who the alms went to and who went without.', ['population: small']),
    w('The church\'s roof and the poor box both want coin, and there is not enough for both.', ['church']),
  ],
  religious__governance_fractured__dominant: [T0,
    w('Has no hands to enforce anything it settles; its word holds only while people choose to keep it.'),
    w('Every quarrel it settles is one the council failed to settle, and the council knows it.', ['ruling body'], ['ruler: priest']),
  ],
  religious__contested__dominant: [T0,
    w('Whatever it says of the seat, part of the congregation will have hoped for the other answer.'),
    w('The council wants its word on the seat; giving it, or holding it back, both cost the faith friends.', ['ruling body'], ['ruler: priest']),
  ],
  government__contested__dominant: [T0,
    w('Cannot carry the council on anything hard while so many doubt the seat\'s right.', ['ruling body']),
    w('Must answer for every choice twice: once to those who back the seat, once to those who doubt it.'),
  ],
};

// ── structuralPosition ────────────────────────────────────────────────────────────────────────────────────────────────────
export const POSITION_POOLS = {
  // the holder's rows open "Holds the seat" (N1, N3); the dual-hat holder's house follows, second, as today
  government__stable__dominant: [T0,
    w('Holds the seat with the council beside it; in quiet times the place lets them get on with it.', ['ruling body']),
    w('Holds the seat, and people accept it; the market days run and few complain of the dues.', ['market']),
    w('Holds the seat, and people accept it; quarrels that need judging go to the court.', ['court sits']),
    w('Holds the seat, and in a place this small everyone knows it; most quarrels end at its door.', ['population: small']),
    w('Holds the seat in good years; the place is comfortable, and few begrudge what the seat costs.', ['prosperity: ≥ comfortable']),
    w('Holds the seat, and people accept it; there is enough coin for the everyday work, if little over.', ['prosperity: moderate']),
    w('Holds the seat while {export} goes out and coin comes back; people accept it, and there is room to act.', [X]),
    w('Holds the seat, and nobody is pressing to take it; there is time to act.'),
  ],
  military__stable__dominant: [T0,
    w('Commands {house} in quiet times: the drill, the roster and the gear kept ready.', [H]),
    w('Commands those under arms in quiet times; the walls are walked, and little more is asked.', ['walls']),
    w('Commands those under arms in quiet times; most days the work is the market crowds and the odd brawl.', ['market']),
    w('Commands those under arms in a large place at peace; the work is many small quarrels, not one big one.', ['population: large']),
    w('Keeps those under arms ready in a quiet season; nothing calls on them but routine.'),
    w('Commands those under arms while the place is quiet; the work is the rounds, the roll and the pay.'),
    w('Commands those under arms in quiet times; the hard part is keeping idle hands sharp.'),
  ],
  religious__stable__dominant: [T0,
    w('Leads the faith from {house}; in quiet times the work is the services, the feast days and the burials.', [H]),
    w('Leads the faith across a large place, with many houses of worship and a priest for each.', ['population: large', 'church']),
    w('Leads the faith in a small place, where the priest knows every family by name.', ['population: small', 'church']),
    w('Leads the faith in an ordinary year: services, feast days, weddings and burials.'),
    w('Leads the faith while the place is at peace; the work is the round of services and the needs of the poor.'),
    w('Leads the faith in quiet times; the council asks its blessing on the great days and leaves it be on the rest.', ['ruling body'], ['ruler: priest']),
    w('Leads the faith in a settled season, with no crisis to call the faithful together.'),
  ],
  economy__stable__subordinate: [T0,
    w('Keeps {house} going in quiet times, a smaller house behind the leading one in the trade.', [H]),
    w('Runs a smaller house behind the leading one, in a place that sends out {export}.', [X]),
    w('Runs a smaller house in the trade, second to the leading one, in a steady season.'),
    w('Runs one of the many smaller houses of a large place, behind the leading one in the trade.', ['population: large']),
    w('Runs a smaller house behind the leading one; it keeps its own regulars on market days.', ['market']),
    w('Runs a smaller house in the guild, behind the leading one, in a steady season.', ['guild']),
  ],
  // claims no secure hold and no say, so the low-standing card may read it too (positionForStanding maps index 0 alone)
  economy__stable__dominant: [T0,
    w('Heads {house}, the leading house in the trade, in a steady season.', [H]),
    w('Heads the leading house in a trade that sends {export} out of the place.', [X]),
    w('Heads the leading house in the trade of a large place, with many smaller houses behind it.', ['population: large']),
    w('Heads the leading house in the trade while business is steady and no one presses it.'),
  ],
  government__stable__subordinate: [T0,
    w('Keeps {house} for the seat, day to day, with no crisis to answer.', [H]),
    w('Holds a post under the council; the work is the daily round, and the round is quiet.', ['ruling body']),
    w('Holds a small post of the seat and does its daily work; nothing out of the ordinary is asked of it.'),
    w('Holds a post of the seat whose busiest days are market days.', ['market']),
    w('Holds a post of the seat in good years, when the work is steady and the purse sound.', ['prosperity: ≥ comfortable']),
  ],
  magic__stable__dominant: [T0,
    w('Heads {house} in quiet times; there is steady work for every caster who wants it.', [H]),
    w('Heads the casters of a large place, where there is call for spells every day.', ['population: large']),
    w('Heads the casters in good years, when people can afford to pay for spellwork.', ['prosperity: ≥ comfortable']),
    w('Heads the casters in a quiet season; the work is the ordinary run of charms and wards.'),
  ],
  other__stable__dominant: [T0,
    w('Heads one of {house}, whose old rights still count for something in the place.', [H]),
    w('Heads an old family whose name is older than the seat itself.'),
    w('Heads an old family among many in a large place, where an old name opens doors but does not rule.', ['population: large']),
  ],
  government__governance_fractured__dominant: [T0,
    w('Holds the seat, but the council no longer moves when it asks, and some orders go unanswered.', ['ruling body']),
    w('Holds the seat in name; in a place this small everyone sees who no longer comes when called.', ['population: small']),
    w('Holds the seat in name; when it calls the neighbours out, fewer come than used to.', ['militia']),
    w('Holds the seat, but its word now carries only as far as people choose to let it.'),
  ],
  government__economic_stress__dominant: [T0,
    w('Holds the seat while money is short, in a place that lives on what its {export} fetches.', [X]),
    w('Holds the seat while money is short, and {import} must still be bought in at whatever it costs.', [I]),
    w('Holds the seat in a small place gone short of coin, where everyone knows what has gone unpaid.', ['population: small']),
    w('Holds the seat while money is short, and every council meeting comes back to the same few coins.', ['ruling body']),
    w('Holds the seat in lean years; people are patient with it, but they keep count.'),
  ],
  religious__economic_stress__dominant: [T0,
    w('Leads the faith from {house} while money is short, and more people come to its door for alms.', [H]),
    w('Leads the faith in a small place gone short of coin, where the priest knows which households are going without.', ['population: small', 'church']),
    w('Leads the faith through lean years, when people lean on it more and give it less.'),
  ],
  religious__governance_fractured__dominant: [T0,
    w('Leads the faith while the seat fails; more disputes now end at {house} than at the seat\'s door.', [H]),
    w('Leads the faith while fewer heed the seat, and more ask the faith to settle what the seat once did.'),
  ],
  religious__contested__dominant: [T0,
    w('Leads the faith from {house} while many doubt the seat\'s right; both sides listen for what is said there.', [H]),
    w('Leads the faith while the seat\'s right is in doubt, and people wait to hear which way it leans.'),
  ],
  government__contested__dominant: [T0,
    w('Holds the seat while many question its right, and the questions are asked openly.'),
  ],
};

// the crafts rows are the economy rows; the `other` crisis keys are the `other` stable rows (the writer's own fill loop)
export const poolKeyOf = (key) => String(key).replace(/^crafts__/, 'economy__').replace(/^other__(corruption|food_crisis|economic_stress|contested)__/, 'other__stable__');
