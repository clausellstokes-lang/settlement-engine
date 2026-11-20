/**
 * npcStructureVariants.js — PEOPLE-1 B1 (2026-11-20; the chair's ruling of 16:41 UTC on
 * `docs/chair/2026-11-20/content/people/PROPOSAL-structuralPosition.md`, as amended by `READ-M1-npcStructure.md`): THE
 * POOLED WORDINGS OF A CARD'S PLACE IN THE ORDER (`npcs[].structuralPosition`), keyed by the writer's own `T` key
 * (`generators/npcStructure.js`).
 *
 * Each row is a declared line `{ text, needs, excludes }`, resolved by `drawDeclared.js :: filterDeclared` against
 * `factsOf(settlement)` (the card handed as `ctx.npc` for the `own house` atom), and the card's wording is chosen among the
 * admitted rows by `kernel/proseHash.js :: pickVariantMixed`, keyed `<settlement _seed>::npcStructure.structuralPosition::<card
 * id>`: no roll. ONE HOME FOR EVERY INDEX 0 (PEOPLE-1 B1c, the chair's ruling of 20:30 UTC): the pools hold the siblings
 * ONLY; the caller (`npcStructure.js :: pooledLineOf`) composes [the writer's own `T` row's line, ...the pool], so the `T` row
 * is index 0 (CANONICAL-AT-ZERO, byte for byte, its literal in the writer's table alone), a seedless call prints it, and the
 * row written first here is index 1 (the gates' `#n` keys and the ledger's `lineId` count the composed pool). The stable
 * pools' rows inherit their row's own declaration (`excludes: crisis`, the writer's CALM_ONLY);
 * the crisis pools' rows claim no calm. A `{house}` slot is the card's own house stamped public at birth (`people/goals.js :: houseFill`; never a criminal or clandestine one), an
 * `{export}` or `{import}` slot the place's first good of that list (`people/goals.js :: resourceFill`); a row whose slot
 * fills with nothing is not a candidate.
 *
 * LEFT OUT, by the ruling: the faith's blessing custom (struck); the old family's "Heads one of {house}" (the card's own
 * house is not its family: the docks, the dairy, the fisher's landing on the births read). The limits of the post
 * (`npcs[].activeConstraint`) sit beside it, `CONSTRAINT_VARIANTS` (PEOPLE-1 B1b, below).
 *
 * Pure data. The census declarations: `docs/census/declarations/npcStructureVariants.POSITION_VARIANTS.json`,
 * `npcStructureVariants.CONSTRAINT_VARIANTS.json`.
 * @enforced-by tests/generators/people/npcPositionPools.test.js
 * @enforced-by tests/generators/people/npcConstraintPools.test.js
 */

/** @typedef {Readonly<{ text: string, needs: ReadonlyArray<string>, excludes: ReadonlyArray<string>, house?: 'people' | 'building' | 'family' }>} PositionRow */

/** @type {Readonly<Record<string, ReadonlyArray<PositionRow>>>} */
export const POSITION_VARIANTS = Object.freeze({
  // the seat's holder in a calm place: every wording opens "Holds the seat" (N1, N3); the dual-hat holder's house follows
  government__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat with the council beside it; in quiet times the work is the ordinary business.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat; the market days run and the dues come in.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat; quarrels that need judging go to the court.', needs: ['court sits'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat, and in a place this small everyone knows it; most quarrels end at its door.', needs: ['population: small'], excludes: ['crisis'] }),
    Object.freeze({ text: "Holds the seat in good years; the place is comfortable, and the seat's costs are met.", needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat; there is enough coin for the everyday work, if little over.', needs: ['prosperity: moderate'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat while the place sends out {export} and coin comes back; there is room to act.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat in a quiet season; there is time to act.', needs: [], excludes: ['crisis'] }),
  ]),
  military__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Commands {house} in quiet times: the drill, the roster and the gear kept ready.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in quiet times; the walls are walked, and little more is asked.', needs: ['walls'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in quiet times; most days the work is the market crowds and the odd brawl.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in a large place at peace; the work is many small quarrels, not one big one.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Keeps those under arms ready in a quiet season; nothing calls on them but routine.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms while the place is quiet; the work is the rounds, the roll and the pay.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in quiet times; the hard part is keeping idle hands sharp.', needs: [], excludes: ['crisis'] }),
  ]),
  religious__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Leads the faith from {house}; in quiet times the work is the services, the feast days and the burials.', needs: ['own house'], excludes: ['crisis'] }),
    // the read's rewrite: the count of houses struck, the large place alone
    Object.freeze({ text: 'Leads the faith across a large place, where its people are too many for one priest to know.', needs: ['population: large', 'church'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith in a small place, where the priest knows every family by name.', needs: ['population: small', 'church'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith in an ordinary year: services, feast days, weddings and burials.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith while the place is at peace; the work is the round of services and the needs of the poor.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith in a settled season, with no crisis to call the faithful together.', needs: [], excludes: ['crisis'] }),
  ]),
  economy__stable__subordinate: Object.freeze([
    Object.freeze({ text: 'Keeps {house} going in quiet times, a smaller house behind the leading one in the trade.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house behind the leading one, in a place that sends out {export}.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house in the trade, second to the leading one, in a steady season.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs one of the many smaller houses of a large place, behind the leading one in the trade.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house behind the leading one; it keeps its own regulars on market days.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house in the guild, behind the leading one, in a steady season.', needs: ['guild'], excludes: ['crisis'] }),
  ]),
  // claims no secure hold and no say, so a head of low standing may read any of it (`positionForStanding` maps index 0 alone)
  economy__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Heads {house}, the leading house in the trade, in a steady season.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the leading house in a trade that sends {export} out of the place.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the leading house in the trade of a large place, with many smaller houses behind it.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the leading house in the trade while business is steady and no one presses it.', needs: [], excludes: ['crisis'] }),
  ]),
  government__stable__subordinate: Object.freeze([
    Object.freeze({ text: 'Keeps {house} for the seat, day to day, with no crisis to answer.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a post under the council; the work is the daily round, and the round is quiet.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a small post of the seat and does its daily work; nothing out of the ordinary is asked of it.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a post of the seat whose busiest days are market days.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a post of the seat in good years, when the work is steady and the purse sound.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
  ]),
  // claims no secure hold, so a head of low standing may read any of it (`positionForStanding` maps index 0 alone)
  magic__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Heads {house} in quiet times; the work is the ordinary run of spellwork.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the casters of a large place, where there is call for spells every day.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the casters in good years, when people can afford to pay for spellwork.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the casters in a quiet season; the work is the ordinary run of charms and wards.', needs: [], excludes: ['crisis'] }),
  ]),
  // the old families' row also serves the four crisis keys the writer fills from it, so its wordings claim no calm
  other__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Heads an old family whose name still opens doors here.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads an old family among many in a large place, where an old name opens doors but does not rule.', needs: ['population: large'], excludes: ['crisis'] }),
  ]),
  // the small places' crisis rows: a trouble the record already names; the wordings change the vantage, never the weight
  government__governance_fractured__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat, but the council no longer moves when it asks, and some orders go unanswered.', needs: ['ruling body'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in name; in a place this small everyone sees who no longer comes when called.', needs: ['population: small'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in name; when it calls the neighbours out, fewer come than used to.', needs: ['militia'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat, but its word now carries only as far as people choose to let it.', needs: [], excludes: [] }),
  ]),
  government__economic_stress__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat while money is short, in a place that lives on what it gets for its {export}.', needs: ['export good'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat while money is short, and {import} must still be bought in at whatever it costs.', needs: ['import good'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in a small place gone short of coin, where everyone knows what has gone unpaid.', needs: ['population: small'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat while money is short, and every council meeting comes back to the same few coins.', needs: ['ruling body'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in lean years, and every cost it asks is counted.', needs: [], excludes: [] }),
  ]),
  religious__economic_stress__dominant: Object.freeze([
    Object.freeze({ text: 'Leads the faith from {house} while money is short, and more people come to its door for alms.', needs: ['own house'], excludes: [] }),
    Object.freeze({ text: 'Leads the faith in a small place gone short of coin, where the priest knows which households are going without.', needs: ['population: small', 'church'], excludes: [] }),
    Object.freeze({ text: 'Leads the faith through lean years, when people lean on it more and give it less.', needs: [], excludes: [] }),
  ]),
  religious__governance_fractured__dominant: Object.freeze([
    Object.freeze({ text: "Leads the faith while the seat fails; more disputes now end at {house} than at the seat's door.", needs: ['own house'], excludes: [] }),
    Object.freeze({ text: 'Leads the faith while fewer heed the seat, and more ask the faith to settle what the seat once did.', needs: [], excludes: [] }),
  ]),
  religious__contested__dominant: Object.freeze([
    Object.freeze({ text: "Leads the faith from {house} while many doubt the seat's right; both sides listen for what is said there.", needs: ['own house'], excludes: [] }),
    Object.freeze({ text: "Leads the faith while the seat's right is in doubt, and people wait to hear which way it leans.", needs: [], excludes: [] }),
  ]),
  government__contested__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat while many question its right, and the questions are asked openly.', needs: [], excludes: [] }),
  ]),
});

/**
 * PEOPLE-1 B1b (2026-11-20; the chair's ruling of 16:51 UTC on PROPOSAL-activeConstraint.md, corrected at 17:13 UTC): THE
 * POOLED LIMITS OF A CARD'S POST (`npcs[].activeConstraint`), keyed and chosen as `POSITION_VARIANTS` is, keyed
 * `<_seed>::npcStructure.activeConstraint::<card id>`. The chair's eight rewordings are written as ruled. A `{house}` row
 * names the kind of house it fits (`house`: 'people', a body of people under arms; 'building', a house that stands in repair;
 * 'family', an old family's house; absent, any public house of the card's own); the writer fills `{house}` only with a house
 * its home reads of that kind (`npcStructure.js :: HOUSE_KINDS_FIT`: the defence partition's force buckets; the catalogue's
 * faith shelf; an old family's house has no home, so that row never fills, and is held for the chair's ruling). Rows whose
 * condition no atom states (the trade that holds the seat; the card whose house is the watch) are gated in the writer by the
 * record (`npcStructure.js :: CONSTRAINT_ROW_GATES`). A row naming the paid watch also needs `watch` (the walker's thing).
 * @type {Readonly<Record<string, ReadonlyArray<PositionRow>>>}
 */
export const CONSTRAINT_VARIANTS = Object.freeze({
  // the seat's holder in a calm place: a plain limit of the office, read from who shares the seat and what the place has
  government__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Cannot act alone: nothing is done here until the rest of the council agrees.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Does not set the prices or the wages of the trades; for anything touching them, the seat must deal with the guild.', needs: ['guild'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Has no say over the church or its clergy; whatever the seat wants from the faith, it must ask for.', needs: ['church'], excludes: ['crisis', 'ruler: priest'] }),
    Object.freeze({ text: 'There is coin for the everyday work and little over; any new building or hire means asking the households for more.', needs: ['prosperity: moderate'], excludes: ['crisis'] }),
    Object.freeze({ text: 'The coffers bear the everyday work and more, but every new cost must still be argued for before those who pay it.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Has no paid hands to see its word kept; what the seat decides, the neighbours must be willing to carry out.', needs: ['militia'], excludes: ['crisis', 'paid watch', 'garrison', 'mercenary'] }),
    Object.freeze({ text: 'Its word is kept by the paid watch, and every extra round the watch walks comes out of the same purse.', needs: ['paid watch', 'watch'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Rules by custom alone; a household that will not listen must be talked round, not made to.', needs: ['ruler: elder', 'population: small'], excludes: ['crisis', 'court sits'] }),
    Object.freeze({ text: 'Cannot push through anything the strongest power in the place sets itself against; here that power outweighs the seat.', needs: ['seat outranked'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Needs the other powers of the place on its side for anything large; the seat leads, but not alone.', needs: ['rival power'], excludes: ['crisis', 'seat outranked'] }),
    Object.freeze({ text: 'Does not judge the hard cases itself; those go to the court, and the court decides them in its own way.', needs: ['court sits'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Can set the market days and the tolls, but cannot make buyers come or sellers stay.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'In a place this large the seat sees little for itself; it must act on what its people bring it.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Cannot please everyone at once; whatever the seat gives one side, another asks for next.', needs: [], excludes: ['crisis'] }),
  ]),
  military__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Cannot raise more hands or more pay without the council, and in quiet years the council is careful with coin.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Must keep {house} fed and paid out of what the seat allows, and the seat allows what quiet years seem to need.', needs: ['own house'], excludes: ['crisis'], house: 'people' }),
    Object.freeze({ text: 'The walls want upkeep every year; the coin for it has to be asked for, and in quiet years it comes slowly.', needs: ['walls'], excludes: ['crisis'] }),
    Object.freeze({ text: 'The place can afford its guard, but while nothing threatens, every extra hand must be argued for.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'There is enough for the hands already under arms and little over; a larger force would mean new dues.', needs: ['prosperity: moderate'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Much of its strength is neighbours who turn out when called, and they have fields and trades to get back to.', needs: ['militia'], excludes: ['crisis', 'paid watch'] }),
    Object.freeze({ text: 'Hired companies are paid by the season, and keeping them on when nothing threatens is hard to argue for.', needs: ['mercenary'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Answers to the seat for every hand and every coin; it cannot set its own numbers.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Must share the coin for keeping order with the paid watch, and it is the watch that people see every day.', needs: ['paid watch', 'watch'], excludes: ['crisis'] }),
    Object.freeze({ text: 'In a place this large, those under arms are spread thin across many streets.', needs: ['population: large', 'tier: ≥ village'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Drill keeps hands ready but not keen; quiet years wear on discipline.', needs: [], excludes: ['crisis'] }),
  ]),
  religious__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Keeping {house} in repair takes alms, and alms come slowly when nothing troubles people.', needs: ['own house'], excludes: ['crisis'], house: 'building' }),
    Object.freeze({ text: 'Does not rule here; whatever the faith wants of the council, it must ask for.', needs: ['ruling body'], excludes: ['crisis', 'ruler: priest'] }),
    Object.freeze({ text: 'Has few hands to help; in a place this small most of the faith\'s work falls to one person.', needs: ['population: small'], excludes: ['crisis'] }),
    Object.freeze({ text: 'The priests under it answer in name, but each keeps their own flock and their own ways.', needs: ['population: large', 'church'], excludes: ['crisis'] }),
    Object.freeze({ text: 'The faithful give well in good years, but gifts come with the givers\' wishes attached.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Cannot command belief, only ask for it; what it has is what people choose to give.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'The work is the same each week and each year, and doing it well earns thanks but little say.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Oaths and marriages are the faith\'s to bless, but quarrels over them go before the court.', needs: ['court sits'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Must see to the faith\'s own people as well as its flock, and both expect the same patience.', needs: [], excludes: ['crisis'] }),
  ]),
  economy__stable__subordinate: Object.freeze([
    Object.freeze({ text: 'What {house} can take on is limited to what the leading house leaves alone.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'The best of the {export} trade is already spoken for; the smaller houses take what is left.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Must keep to the guild\'s rules on prices and hands, rules the bigger houses had more say in writing.', needs: ['guild'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Sells on the same market days as the leading house, and buyers go to the bigger name first.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Has less coin than the bigger houses to wait on a slow buyer, so it takes smaller, quicker deals.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'In good years there is custom enough for all, but the best of it goes to the leading house first.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'In a place this large there are many small houses after the same custom.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Has little voice when the council sets the dues on trade; the leading house speaks first.', needs: ['ruling body'], excludes: ['crisis'] }),
  ]),
  economy__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Does not set the dues on trade; the council does, and the council hears every house.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Lives on the place\'s trade in {export}; whatever cuts that trade cuts this house first.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Must buy in {import} like everyone else, at prices set somewhere else.', needs: ['import good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Being first in the trade means being the one every complaint about prices is brought to.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Must keep the smaller houses of the guild content; the guild\'s rules bind the leading house too.', needs: ['guild'], excludes: ['crisis'] }),
  ]),
  government__stable__subordinate: Object.freeze([
    Object.freeze({ text: 'Runs {house} on what the seat allots it, and must ask before spending more.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Answers to the council for every coin and every choice; little is left to the post\'s own judgment.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Can do only what the seat has given the post to do; anything more must be asked for.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'The purse is sound in good years, but every coin the post spends is counted by someone above it.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Has enough to do the work and no more; there is nothing spare for doing it better.', needs: ['prosperity: moderate'], excludes: ['crisis'] }),
  ]),
  magic__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Must keep {house} paid for out of fees and patrons, and patrons want a say in the work.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Must answer to the council for what is cast within the place.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'A spell gone wrong is remembered longer than a hundred done right; the casters\' good name is always at stake.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Some people here will not buy a spell at any price, and no fair dealing changes their minds.', needs: [], excludes: ['crisis'] }),
  ]),
  // the old families' row also serves the four crisis keys the writer fills from it; its wordings print only on a card whose
  // category IS `other` (the chair's (d)), and claim no calm
  other__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Has no seat on the council by right; what the family wants, it must win through friends there.', needs: ['ruling body'], excludes: ['crisis'] }),
    // the read's agreement rule: rewritten to need no agreement with the house's own name
    Object.freeze({ text: 'The old honours of {house} still stand, but the seat decides what those honours are worth.', needs: ['own house'], excludes: ['crisis'], house: 'family' }),
    Object.freeze({ text: 'Old rights count only as far as people still honour them, and fewer remember why they should.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'The family\'s wealth is in land and name, and neither turns into coin quickly.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
  ]),
  // the small places' crisis rows (a trouble the record already names: the wordings change the vantage, never the weight)
  government__governance_fractured__dominant: Object.freeze([
    Object.freeze({ text: 'Cannot get the council to agree on any remedy, and cannot act without it.', needs: ['ruling body'], excludes: [] }),
    Object.freeze({ text: 'Has no paid hands to make its word stick; it must win people back one household at a time.', needs: ['militia'], excludes: ['paid watch', 'garrison', 'mercenary'] }),
    Object.freeze({ text: 'In a place this small, every attempt to take charge again is watched and talked over by everyone.', needs: ['population: small'], excludes: [] }),
    Object.freeze({ text: 'Every order that goes unanswered makes the next one easier to ignore.', needs: [], excludes: [] }),
  ]),
  government__economic_stress__dominant: Object.freeze([
    Object.freeze({ text: 'Every coin spent on the walls is a coin not spent on relief, and both are wanted.', needs: ['walls'], excludes: [] }),
    Object.freeze({ text: 'Cannot raise the dues without the council, and the council knows the households cannot pay more.', needs: ['ruling body'], excludes: [] }),
    Object.freeze({ text: 'Must still buy in {import}, and that comes first, before any repair or relief.', needs: ['import good'], excludes: [] }),
    Object.freeze({ text: 'Can promise little and pay for less, and every refusal is remembered.', needs: [], excludes: [] }),
  ]),
  religious__economic_stress__dominant: Object.freeze([
    Object.freeze({ text: 'Keeping {house} in repair and feeding the poor draw on the same thin purse.', needs: ['own house'], excludes: [], house: 'building' }),
    Object.freeze({ text: 'Can give only what it is given, and in lean years less is given.', needs: [], excludes: [] }),
    Object.freeze({ text: 'In a place this small, everyone knows who the alms went to and who went without.', needs: ['population: small'], excludes: [] }),
    Object.freeze({ text: 'The church\'s roof and the poor box both want coin, and there is not enough for both.', needs: ['church'], excludes: [] }),
  ]),
  religious__governance_fractured__dominant: Object.freeze([
    Object.freeze({ text: 'Has no hands to enforce anything it settles; its word holds only while people choose to keep it.', needs: [], excludes: [] }),
    Object.freeze({ text: 'Every quarrel it settles is one the council failed to settle, and the council knows it.', needs: ['ruling body'], excludes: ['ruler: priest'] }),
  ]),
  religious__contested__dominant: Object.freeze([
    Object.freeze({ text: 'Whatever it says of the seat, part of the congregation will have hoped for the other answer.', needs: [], excludes: [] }),
    Object.freeze({ text: 'The council wants its word on the seat; giving it, or holding it back, both cost the faith friends.', needs: ['ruling body'], excludes: ['ruler: priest'] }),
  ]),
  government__contested__dominant: Object.freeze([
    Object.freeze({ text: 'Cannot carry the council on anything hard while so many doubt the seat\'s right.', needs: ['ruling body'], excludes: [] }),
    Object.freeze({ text: 'Must answer for every choice twice: once to those who back the seat, once to those who doubt it.', needs: [], excludes: [] }),
  ]),
});

// every row's declaration frozen with it (the rows are written with plain arrays, as the declaration walkers read them)
for (const pools of [POSITION_VARIANTS, CONSTRAINT_VARIANTS]) for (const pool of Object.values(pools)) for (const row of pool) { Object.freeze(row.needs); Object.freeze(row.excludes); }

/**
 * The `T` keys whose row is another key's row (the writer's own tables): the crafts rows are the trade's, word for word; the
 * old families' four crisis keys are the old families' stable row itself (`npcStructure.js`'s fill loop). Each reads that
 * key's pool, in both tables.
 * @type {Readonly<Record<string, string>>}
 */
export const POSITION_POOL_OF = Object.freeze({
  crafts__stable__dominant: 'economy__stable__dominant',
  crafts__stable__subordinate: 'economy__stable__subordinate',
  other__corruption__dominant: 'other__stable__dominant',
  other__food_crisis__dominant: 'other__stable__dominant',
  other__economic_stress__dominant: 'other__stable__dominant',
  other__contested__dominant: 'other__stable__dominant',
});
