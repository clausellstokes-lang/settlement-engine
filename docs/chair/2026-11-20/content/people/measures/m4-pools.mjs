// PEOPLE-1 seat M4 (2026-11-20): THE PROPOSED POOLS, as data (the proposals' §4 tables are this file, line for line).
// Nothing here is in src/. A builder would move each pool to its own data file (the proposals name them).
//
// A relation pool is keyed by the branch id m4-common.mjs :: relationBranch gives the row; a description pool by its index-0
// line's exact text (the line a power's description OPENS with; a standing coda after it is kept). Index 0 is never listed:
// it is today's exact line, always eligible (canonical-at-zero). Every variant declares the atoms it NEEDS (and EXCLUDES) in
// the vocabulary's own spelling (src/domain/facts/factVocabulary.js); a line with no atom restates its branch's own claim
// from another vantage (the style law §8) and claims nothing the branch does not.
//
// Relation templates: {G} {Mil} {M} {R} {C} {N} {L} name a power of the pair as the writer names it (factionDynamics.js ::
// say, its article form; a sentence's first "the" is raised by the writer's own `opening`); {G's} its possessive (sayOf);
// {M|works|work} the verb as the power's number takes it (the writer's `verb`). Roles by branch: GM G=pair[0] Mil=pair[1];
// GE G,M; GR G,R; MC M,C (L = the landholders the line already names); MR M,R; NG N=pair[0] G=pair[1].

/** @typedef {{ text: string, needs?: string[], excludes?: string[], vantage: string, why: string }} Variant */

/** @type {Record<string, Variant[]>} */
export const RELATION_POOLS = {
  // MR.dep — merchant and faith, dependent (factionDynamics.js, "Merchant ↔ Religious", the last branch)
  'MR.dep': [
    { text: '{R} could not keep up the faith\'s charity without the gifts of {M}, and {M} would have more trouble from the poor without it. Each needs the other, and neither likes it.', vantage: 'the official', why: 'the branch\'s own bargain, from the faith\'s side' },
    { text: '{R} {R|feeds|feed} the poor here, and {M} {M|pays|pay} for it; the poor stay quiet. Each needs the other, and neither likes it.', vantage: 'the local', why: 'the branch\'s own bargain, said as who does what' },
    { text: '{M} {M|gives|give} to the church, {R} {R|gives|give} to the poor, and the poor stay quiet. Each needs the other, and neither likes it.', needs: ['church'], vantage: 'the local', why: 'the place has a church (the faith reading\'s hasChurch): the charity named by its house' },
    { text: '{M} {M|gives|give} to the hospital and to the alms of {R}; the sick and the poor are looked after, and the streets stay quiet. Each needs the other, and neither likes it.', needs: ['hospital'], vantage: 'the official', why: 'a hospital stands (defence.js hospital): the charity read from its house, as the brief directs' },
    { text: 'What {M} {M|earns|earn} at the market pays for the charity of {R}, and the charity keeps the poor off the merchants\' doorsteps. Each needs the other, and neither likes it.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market (market.js): the merchants\' money read from it' },
    { text: '{M} {M|makes|make} {M|its|their} money on what the place sends out and brings in, and part of it goes to {R} for the poor. Each needs the other, and neither likes it.', needs: ['exports', 'imports'], vantage: 'the trade', why: 'the place has an export and an import list (canonExports, canonImports): the merchants\' trade, unnamed' },
    { text: 'The poor fed at the monastery and the church are fed on merchant money, and {R} and {M} both know it. Each needs the other, and neither likes it.', needs: ['institution: monastery', 'church'], vantage: 'the local', why: 'a monastery or friary and a church stand: the faith\'s charity read from its houses' },
    { text: 'In a place this well off, {M} can spare coin for the charity of {R}, and {M|does|do}, because the charity keeps the poor quiet. Each needs the other, and neither likes it.', needs: ['prosperity: ≥ comfortable'], vantage: 'the trade', why: 'Comfortable or better (prosperityRank.js): the purse can spare it' },
    { text: 'There is little coin to spare here, and what {R} {R|gives|give} the poor comes mostly from {M}. Each needs the other, and neither likes it.', needs: ['prosperity: ≤ moderate'], vantage: 'the official', why: 'Moderate or below: little to spare' },
    { text: '{M} {M|pays|pay}, {R} {R|gives|give}, and the poor take what is given and keep the peace. Each needs the other, and neither likes it.', vantage: 'the local', why: 'the branch\'s own bargain, said as who does what' },
    { text: 'In a place this large the faith\'s charity costs more than the faith has, and {M} {M|makes|make} up the rest; the poor stay quiet. Each needs the other, and neither likes it.', needs: ['population: large'], vantage: 'the official', why: 'a large place' },
  ],
  // GE.sub — the seat and the merchants, merchants subordinate (factionDynamics.js, "Governing ↔ Merchant", ratio < 0.6)
  'GE.sub': [
    { text: '{M} {M|makes|make} the money, but {G} {G|makes|make} the rules, and a hearing in the hall costs {M} something every time.', vantage: 'the trade', why: 'the branch\'s own claim (the rules are the seat\'s; a hearing is paid for)' },
    { text: '{M} {M|trades|trade} on the terms {G} {G|sets|set}, and when {M|it wants|they want} them changed, {M|it|they} must pay to be heard in the hall.', vantage: 'the official', why: 'the branch\'s own claim, from the seat\'s side' },
    { text: 'What {M} {M|sends|send} out of the place goes out under the rules {G} {G|sets|set}; {M} can ask for better terms, not set {M|its|their} own.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list: the merchants\' trade, unnamed' },
    { text: 'When merchants quarrel over a contract here, the court settles it, not {M}; {M} {M|works|work} under the rules {G} {G|sets|set}.', needs: ['court sits'], vantage: 'the official', why: 'a court sits on the roster (courtHoldersOf): the judging is not the merchants\'' },
    { text: '{M} {M|does|do} well here, but on the hall\'s terms: {G} {G|sets|set} the rules, and {M} {M|pays|pay} to be heard.', needs: ['prosperity: ≥ comfortable'], vantage: 'the local', why: 'Comfortable or better: the merchants do well' },
    { text: 'Every cargo that comes over the docks is landed under the rules {G} {G|sets|set}; {M} {M|pays|pay} for a hearing when {M|it wants|they want} them changed.', needs: ['docks'], vantage: 'the traveller', why: 'docks stand (institutions.js docks): the trade read from them' },
    { text: 'Loans and debts here are written under the law {G} {G|sets|set}, and {M} {M|pays|pay} for a hearing in the hall when {M|it wants|they want} that law changed.', needs: ['institution: bank'], vantage: 'the trade', why: 'a bank stands (institutions.js bank): the merchants\' lending read from it' },
  ],
  // GM.sub+soldiers — the seat and the force, force subordinate, soldiers on the roster (ratio ≤ 0.5, garrison or hired company)
  'GM.sub+soldiers': [
    { text: '{Mil} answers to {G} for what it does; the soldiers enforce what the hall decides, and do not decide it.', needs: ['soldiers'], vantage: 'the official', why: 'the branch\'s own claim; soldiers stand (the writer\'s own soldiersStand gate is this atom)' },
    { text: 'Ask who gives the orders here and the answer is {G}; {Mil} carries them out, and the soldiers do not make the law.', needs: ['soldiers'], vantage: 'the traveller', why: 'the branch\'s own claim, as a visitor hears it' },
    { text: '{G} {G|decides|decide}, and {Mil} carries it out; the garrison\'s officers take their orders from the hall, not the other way round.', needs: ['garrison'], vantage: 'the watch', why: 'a garrison stands, and with it its command (the commander atom\'s own reading)' },
    { text: '{Mil} keeps the walls on {G\'s} orders and has no say in what those orders are; the soldiers enforce the law, they do not make it.', needs: ['walls', 'soldiers'], vantage: 'the watch', why: 'the place has walls (the perimeter, defence.js): the force\'s ground named' },
    { text: '{Mil} makes the arrests, and the court and {G} decide what comes of them; the soldiers enforce the law, they do not make it.', needs: ['court sits', 'soldiers'], vantage: 'the official', why: 'a court sits: the judging is the court\'s, the law the seat\'s' },
    { text: 'In a place this size {Mil} has many streets to keep, and keeps them on {G\'s} orders, not its own; the soldiers enforce the law, they do not make it.', needs: ['population: large', 'soldiers'], vantage: 'the local', why: 'a large place (populationBand.js)' },
  ],
  // GM.sub — the same branch with no soldiers on the roster
  'GM.sub': [
    { text: '{Mil} answers to {G} for what it does; it enforces what the hall decides, and does not decide it.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'Ask who gives the orders here and the answer is {G}; {Mil} carries them out.', vantage: 'the traveller', why: 'the branch\'s own claim, as a visitor hears it' },
    { text: '{Mil} keeps the walls on {G\'s} orders and has no say in what those orders are.', needs: ['walls'], vantage: 'the watch', why: 'the place has walls' },
  ],
  // GM.sym — the seat and the force, symbiotic (0.5 < ratio ≤ 0.85)
  'GM.sym': [
    { text: '{G} cannot keep order without {Mil}, and {Mil} has its standing from {G}; each needs the other to stay strong.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'Orders come from {G}, and {Mil} is who people see carrying them out; each needs the other to stay strong.', vantage: 'the local', why: 'the branch\'s own claim, as people see it' },
    { text: '{Mil} keeps the walls and {G} keeps {Mil}; each needs the other to stay strong.', needs: ['walls'], vantage: 'the watch', why: 'the place has walls' },
    { text: '{G} makes the law, the court judges by it, and {Mil} sees it kept; each needs the other to stay strong.', needs: ['court sits'], vantage: 'the official', why: 'a court sits on the roster' },
    { text: 'A place this size needs both: {G} to give the orders and {Mil} to carry them out across it; each needs the other to stay strong.', needs: ['population: large'], vantage: 'the local', why: 'a large place' },
    { text: 'The garrison takes its orders from {G}, and {G} leans on the garrison; each needs the other to stay strong.', needs: ['garrison'], vantage: 'the watch', why: 'a garrison stands' },
    { text: '{G} calls out {Mil} when it is needed, and {Mil} answers; each needs the other to stay strong.', needs: ['militia'], excludes: ['paid watch'], vantage: 'the watch', why: 'the force is neighbours called out (militia), none paid' },
  ],
  // GM.tense — the seat and the force about level (0.85 < ratio ≤ 1.2)
  'GM.tense': [
    { text: '{G} no longer simply gives {Mil} orders: the two are about as strong as each other, and little is decided without {Mil\'s} agreement.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'Neither {G} nor {Mil} is clearly the stronger now, so {G} asks where it once ordered, and less and less is decided without {Mil}.', vantage: 'the local', why: 'the branch\'s own claim' },
    { text: '{G} and {Mil} now stand about level, and {G} asks {Mil\'s} agreement before it decides anything of weight.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: '{Mil} has grown about as strong as {G}; the elders now ask where they once told, and little is settled without {Mil}.', needs: ['ruler: elder'], vantage: 'the local', why: 'an elder rules (rulerKind.js): the seat is the elders' },
  ],
  // GR.dep — the seat and the faith, dependent (0.5 ≤ ratio < 1.1), the seat collecting taxes (no occupation)
  'GR.dep': [
    { text: 'People pay their taxes to {G} and hear from {R} that they should. Each props up the other.', vantage: 'the local', why: 'the branch\'s own claim (the seat collects the taxes; the faith says its rule is right)' },
    { text: '{G} holds the seat and the purse; {R} {R|holds|hold} people\'s faith, and {R|uses|use} it to say the seat is rightly held. Each props up the other.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: '{G} makes the law, and {R} {R|tells|tell} people it is right to keep it. Each props up the other.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'A newcomer soon learns two things: {G} collects the taxes, and {R} will tell them it has the right to. Each props up the other.', vantage: 'the newcomer', why: 'the branch\'s own claim, as a newcomer meets it' },
    { text: '{G} governs, and {R} {R|tells|tell} the faithful at the church that its rule is rightful. Each props up the other.', needs: ['church'], vantage: 'the local', why: 'the place has a church' },
    { text: 'In a place this small, the priest\'s word that {G} {G|rules|rule} rightly counts for as much as the taxes {G} {G|collects|collect}. Each props up the other.', needs: ['priest', 'population: small'], vantage: 'the local', why: 'a senior cleric is on the roster (the priest atom) and the place is small' },
  ],
  // GR.tense — the faith above the seat (ratio ≥ 1.1)
  'GR.tense': [
    { text: '{R} {R|settles|settle} more of people\'s affairs here than {G} {G|does|do}: marriages, inheritances, hard times. The two do not agree on who decides what.', vantage: 'the local', why: 'the branch\'s own claim' },
    { text: 'Ask about a marriage or an inheritance and you are sent to {R}, not to {G}; the two do not agree on who decides what.', vantage: 'the traveller', why: 'the branch\'s own claim, as a visitor meets it' },
    { text: 'Weddings, wills and help in hard times are all sought at the church, not from {G}, and the two do not agree on who decides what.', needs: ['church'], vantage: 'the local', why: 'the place has a church' },
    { text: 'The priest, not {G}, is who people go to over a marriage, an inheritance or hard times, and the two do not agree on who decides what.', needs: ['priest'], vantage: 'the local', why: 'a senior cleric is on the roster' },
    { text: '{G} meets and decides, but people bring their marriages, inheritances and troubles to {R}; the two do not agree on who decides what.', needs: ['ruling body'], vantage: 'the official', why: 'the seat is a body of more than one (rulingBody.js)' },
    { text: 'In a place this small everyone knows to see {R}, not {G}, about a marriage or a will, and the two do not agree on who decides what.', needs: ['population: small'], vantage: 'the newcomer', why: 'a small place' },
    { text: 'When times are hard, people here go to {R} for help, not to {G}; the two do not agree on who decides what.', needs: ['prosperity: ≤ poor'], vantage: 'the local', why: 'Poor or below (prosperityRank.js)' },
  ],
  // GE.dep — the seat and the merchants, dependent (0.6 ≤ ratio < 1.2)
  'GE.dep': [
    { text: 'Without the taxes and loans of {M}, {G} could not pay its way, and without {G}, {M} would have no one to make debtors pay. Neither can afford to ruin the other.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'A merchant here pays {G} its taxes and expects {G\'s} law to stand behind every bargain. Neither {G} nor {M} can afford to ruin the other.', vantage: 'the trade', why: 'the branch\'s own claim, from the counter' },
    { text: '{M} {M|pays|pay} taxes to {G} and {M|lends|lend} it money, and the court holds {M\'s} debtors to their contracts. Neither can afford to ruin the other.', needs: ['court sits'], vantage: 'the official', why: 'a court sits on the roster' },
    { text: '{G} lives on what the market pays in dues, and {M} {M|lives|live} on the market {G} keeps in order. Neither can afford to ruin the other.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'What the place sends out pays {M} and, through the taxes, {G}; neither can afford to ruin the other.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list' },
    { text: 'Coin is not plentiful here: {G} borrows from {M}, and {M} {M|needs|need} {G} to see that debts are paid. Neither can afford to ruin the other.', needs: ['prosperity: ≤ moderate'], vantage: 'the local', why: 'Moderate or below' },
    { text: 'The place does well, and {G} and {M} both take their share: {G} the taxes, {M} the profits the law protects. Neither can afford to ruin the other.', needs: ['prosperity: ≥ comfortable'], vantage: 'the local', why: 'Comfortable or better' },
  ],
  // MR.tense — merchant and faith, both strong (merchants ≥ 20, faith ≥ 15); every line keeps today's declared `temple` and names the church
  'MR.tense': [
    { text: '{M} and {R} pull at the same purses: the church for its tithes, the merchants for their debts. The church\'s rules on lending are a standing grievance with the merchants.', needs: ['church'], vantage: 'the trade', why: 'the branch\'s own claim; the place has a church' },
    { text: 'A household here owes tithes to {R} and debts to {M}, and each side would rather be paid first. Church land exemptions and the church\'s rules on lending are a standing grievance with the merchants.', needs: ['church'], vantage: 'the local', why: 'the branch\'s own claim, from the household' },
    { text: 'The church asks the households for tithes and {M} {M|asks|ask} them for what they owe, and both want to be paid first. The church\'s rules on lending are a standing grievance with the merchants.', needs: ['church'], vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'Money that goes to {R} as tithe does not come back to the market, and {M} resent it; the church\'s rules on lending are a standing grievance with the merchants.', needs: ['church', 'market'], vantage: 'the trade', why: 'the place keeps a market and a church' },
  ],
  // MC.vote — merchants and craft, tense, no landholding power named (the sibling)
  'MC.vote': [
    { text: 'On trade, {M} and {C} vote together; on who keeps the profit, they fight.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: '{M} and {C} vote together on anything that touches the market, then fight over who keeps the profit.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: '{M} and {C} vote together on what the place sends out, then fight over who keeps the profit of it.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list' },
    { text: 'In council, {M} and {C} vote together whenever trade is at stake; outside it, they fight over who keeps the profit.', needs: ['ruling body'], vantage: 'the official', why: 'the seat is a body of more than one' },
    { text: 'There is money enough in trade here for {M} and {C} to vote together whenever it is at stake, and to fight over who keeps the profit.', needs: ['prosperity: ≥ comfortable'], vantage: 'the local', why: 'Comfortable or better' },
  ],
  // MC.vote-against — the same, the landholding power named ({L} is the name the line already carries)
  'MC.vote-against': [
    { text: 'Against {L}, {M} and {C} vote as one; once the vote is cast, they fight over who keeps the profit.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: '{M} and {C} vote together against {L} whenever trade is at stake, then fight over who keeps the profit.', vantage: 'the trade', why: 'the branch\'s own claim with the sibling\'s scope' },
    { text: '{M} and {C} side together against {L} on anything touching the market, then fight over who keeps the profit.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: '{M} and {C} vote together against {L} on what the place sends out, then fight over who keeps the profit of it.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list' },
    { text: 'In council, {M} and {C} vote together against {L}; outside it, they fight over who keeps the profit.', needs: ['ruling body'], vantage: 'the official', why: 'the seat is a body of more than one' },
    { text: '{M} and {C} stand together against {L} whenever the guilds\' business is at stake, then fight over who keeps the profit.', needs: ['guild'], vantage: 'the trade', why: 'a guild stands (guild.js)' },
  ],
  // NG.sub — the old families under the seat, with merchant money ahead of them (the writer's own condition)
  'NG.sub+merchant': [
    { text: '{N} {N|keeps|keep} {N|its|their} titles and {N|its|their} precedence, but the say {N|it|they} once had now sits with {G} and with merchant money.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'People still give {N} {N|its|their} titles, but they take their business to {G}, and the money is with the merchants.', vantage: 'the local', why: 'the branch\'s own claim, as people act on it' },
    { text: '{G} fills the offices that once went to {N} by right, and merchant money does the rest.', vantage: 'the official', why: 'the branch\'s own claim (the offices have taken the power)' },
    { text: 'In a place this large, titles count for less than offices and money; {N} {N|has|have} the titles, {G} the offices, the merchants the money.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
    { text: 'The market is the merchants\' and the offices are {G\'s}; {N} {N|keeps|keep} {N|its|their} titles and little else.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
  ],
  // NG.sub — the same with no merchant power ahead of them
  'NG.sub': [
    { text: '{N} {N|keeps|keep} {N|its|their} titles and {N|its|their} precedence, but the say {N|it|they} once had now sits with {G}.', vantage: 'the official', why: 'the branch\'s own claim' },
    { text: 'People still give {N} {N|its|their} titles, but they take their business to {G}.', vantage: 'the local', why: 'the branch\'s own claim' },
    { text: '{G} fills the offices that once went to {N} by right.', vantage: 'the official', why: 'the branch\'s own claim' },
  ],
  // NG.dep — the old families under the seat, keeping rights enough to bargain (0.5 ≤ ratio < 0.9, not Suppressed)
  'NG.dep': [
    { text: '{G} rules, but it must bargain with {N} over land and levies rather than simply give orders.', vantage: 'the official', why: 'the branch\'s own claim (land and levies are in both of the writer\'s forms)' },
    { text: '{N} {N|answers|answer} to {G}, but {N|its|their} land and levies give {N|it|them} something to bargain with, and {N|it does|they do}.', vantage: 'the local', why: 'the branch\'s own claim' },
    { text: '{N} {N|holds|hold} land, courts and levies of {N|its|their} own under {G}, enough to bargain rather than simply obey.', needs: ['court sits'], vantage: 'the official', why: 'a court sits (the writer\'s own gate for "courts", FR25 (c))' },
    { text: 'In a place this large, {N} still {N|keeps|keep} enough land and levies of {N|its|their} own to bargain with {G}, not simply obey it.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
  ],
};

/** @type {Record<string, Variant[]>} keyed by the index-0 line a description OPENS with */
export const DESC_POOLS = {
  // ── the seats of the small places (rulingStructure.js :: govDescByFaction / GOV_DESC_OF_UNNAMED_SEAT / the reeve twin; the
  // crisis twin is claimStanding.js :: SEAT_UNDER_CRISIS) ──
  'The oldest heads of the community decide things together; people follow them out of respect and custom, not law.': [
    { text: 'Disputes here go to the oldest heads of the households, who settle them together; people abide by what they decide out of respect, not because any law says so.', vantage: 'the local', why: 'the seat\'s own claim: the elders decide, by respect and custom' },
    { text: 'There is no written law here; the oldest heads of the community decide things together, and people go along with them out of respect and custom.', excludes: ['court sits', 'legal house'], vantage: 'the newcomer', why: 'no court sits and no house of the law stands (courtHoldersOf, legalHouse.js): nothing written to rule by' },
    { text: 'In a place this small, the oldest heads of the community decide things together, and everyone knows them well enough to follow them out of respect and custom.', needs: ['population: small'], vantage: 'the local', why: 'a small place, where everyone knows the elders' },
    { text: 'The oldest heads of the community decide things together, down to who does which work; people follow them by custom and out of respect, not by law.', vantage: 'the official', why: 'the seat\'s own claim (the elders decide), said of the everyday' },
    { text: 'The oldest heads of the community decide things together, from what the place sends out to how a quarrel is settled; people follow them out of respect and custom, not law.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list: what the elders decide includes its trade' },
  ],
  'The oldest heads of the community still decide things together, but fewer and fewer people accept their word.': [
    { text: 'The elders still meet and decide, but more and more households go their own way regardless.', vantage: 'the local', why: 'the crisis twin\'s own claim (the legitimacy crisis)' },
    { text: 'The oldest heads of the community still speak for it, but their word no longer settles things the way it did.', vantage: 'the official', why: 'the crisis twin\'s own claim' },
    { text: 'In a place this small, everyone can see that fewer people now heed the elders, though the elders still decide things together.', needs: ['population: small'], vantage: 'the newcomer', why: 'a small place' },
    { text: 'Decisions are still made by the oldest heads of the community together; fewer people than before accept them.', vantage: 'the official', why: 'the crisis twin\'s own claim' },
  ],
  'Settlement governed by heads of household; decisions by informal consensus among property owners.': [
    { text: 'The heads of the households decide things between them, and nothing is settled until they agree.', vantage: 'the local', why: 'the seat\'s own claim (consensus of the heads of household)' },
    { text: 'Each household with property here has its head at the table, and decisions are made when they all agree.', vantage: 'the official', why: 'the seat\'s own claim (property owners, by consensus)' },
    { text: 'In a place this small the heads of the households simply talk things through until they agree; that is all the government there is.', needs: ['population: small'], vantage: 'the newcomer', why: 'a small place; the Household Council is the seat' },
    { text: 'No one rules alone here: the heads of the households decide together, by agreement among those who own property.', vantage: 'the official', why: 'the seat\'s own claim' },
  ],
  'A headman settles disputes and speaks for the community.': [
    { text: 'Disputes are brought to the headman, and when the community must speak to outsiders, the headman speaks for it.', vantage: 'the official', why: 'the seat\'s own claim (one office: settle and speak)' },
    { text: 'People here take their quarrels to the headman, who also speaks for the community beyond it.', vantage: 'the local', why: 'the seat\'s own claim' },
    { text: 'The headman\'s word settles disputes here, and it is the headman who answers for the community to anyone from outside.', vantage: 'the traveller', why: 'the seat\'s own claim' },
    { text: 'In a place this small one person, the headman, settles the quarrels and speaks for everyone.', needs: ['population: small'], vantage: 'the newcomer', why: 'a small place' },
  ],
  'The elders of the hamlet decide things together, and none of them rules alone.': [
    { text: 'No single elder rules here; the elders of the hamlet decide things together.', vantage: 'the official', why: 'the seat\'s own claim' },
    { text: 'The hamlet\'s elders decide together, and none of them can settle anything alone.', vantage: 'the local', why: 'the seat\'s own claim' },
  ],
  'One of the peasantry, elected by the rest, manages labour and mediates disputes, and answers to the people who chose them.': [
    { text: 'The reeve is one of the villagers, chosen by the rest; the reeve sees the work done and settles disputes, and answers to those who chose them.', vantage: 'the local', why: 'the twin\'s own claim (an elected reeve)' },
    { text: 'The villagers elect one of their own as reeve, to manage the common work and mediate quarrels; the reeve answers to them.', vantage: 'the official', why: 'the twin\'s own claim' },
  ],
  // NOTE (§6 of the proposal): the `priest` atom is false in all 74 villages that print today's line; no variant names a priest
  'The village priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale.': [
    { text: 'People here look to the church for guidance on worldly matters as well as faith; at this scale its moral authority is practical influence too.', needs: ['church'], vantage: 'the local', why: 'a church stands (faithReading hasChurch); the line\'s own claim' },
    { text: 'The church is where the most learned people in the place are found, and at this scale what it says carries into everything else.', needs: ['church'], vantage: 'the newcomer', why: 'a church stands; the line\'s own claim (the most educated)' },
    { text: 'In a place this small the faith\'s moral authority and its practical influence are one and the same.', needs: ['population: small'], vantage: 'the official', why: 'a small place; the line\'s own claim' },
    { text: 'The faith\'s moral authority here is practical influence too; people ask its advice on far more than prayer.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'A newcomer soon finds that the faith\'s word counts here in practical matters as much as in prayer.', vantage: 'the newcomer', why: 'the line\'s own claim' },
    { text: 'Where there is little to go round, the faith\'s help and counsel count for a great deal, and its moral authority is practical influence too.', needs: ['prosperity: ≤ poor'], vantage: 'the local', why: 'Poor or below' },
  ],
  // ── the larger places' heaviest openings (proposed with the same care; the integrator may cut the larger sizes) ──
  'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.': [
    { text: 'Those who work magic here are hired and consulted, never given office; their say comes through their fees, and it is quietly resented.', vantage: 'the official', why: 'the line\'s own claim (the line prints only where practitioners work: settleArcaneToPractitioners)' },
    { text: 'No office here belongs to a mage; the practitioners are consulted when needed and paid for it, and their influence is quietly resented.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'Magical practitioners sell their services here and are asked their opinion, but hold no office; what influence they have is advisory, transactional, and quietly resented.', vantage: 'the trade', why: 'the line\'s own claim' },
    { text: 'People go to the practitioners for what only magic can do and pay their price, but give them no say beyond it; the price is quietly resented.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'Magic is bought here like any skilled work, and the practitioners\' influence goes no further than their customers allow; it is quietly resented.', vantage: 'the trade', why: 'the line\'s own claim (transactional)' },
    { text: 'The council consults the mages when it needs them but gives them no seat; their influence is advisory and paid for, and quietly resented.', needs: ['ruling body'], vantage: 'the official', why: 'the seat is a body of more than one' },
    { text: 'In a place this large there is steady work for magical practitioners, but no office; their influence is advisory, paid for, and quietly resented.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
    { text: 'There is money enough here to keep magical practitioners in work, though not in office; their influence is advisory, transactional, and quietly resented.', needs: ['prosperity: ≥ comfortable'], vantage: 'the trade', why: 'Comfortable or better' },
  ],
  'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.': [
    { text: 'The priests are respected in their own sphere, but in the business of governing they count for little.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'People go to the clergy for their souls and to others for everything else; their moral authority is real, but their political leverage is limited.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'The clergy keep the church and the people\'s faith, but have little say in how the place is run.', needs: ['church'], vantage: 'the local', why: 'the place has a church' },
    { text: 'The clergy\'s word counts for more in church than in council; their moral authority is real, but their political leverage is limited.', needs: ['church', 'ruling body'], vantage: 'the official', why: 'a church; the seat is a body of more than one' },
    { text: 'Clergy and monks are part of daily life here, but stand at the edge of its politics; their moral authority is real, their leverage limited.', needs: ['institution: monastery'], vantage: 'the traveller', why: 'a monastery or friary stands' },
    { text: 'In a place this large the clergy are one voice among many, respected but seldom decisive.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
    { text: 'The courts, not the clergy, settle the place\'s disputes; the clergy\'s authority is moral, and their political leverage limited.', needs: ['court sits'], vantage: 'the official', why: 'a court sits on the roster' },
    { text: 'The clergy have the people\'s respect but little of the hall\'s ear; their political leverage is limited.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'The clergy are heard on matters of conscience, not on matters of trade or tax; their political leverage is limited.', vantage: 'the trade', why: 'the line\'s own claim' },
  ],
  'The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops.': [
    { text: 'The craft masters set their own standards and take on their own apprentices, but outside the workshops few listen to them.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'Each trade here looks after its own work and its own apprentices, and little beyond it.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'The trades govern their own workshops and apprenticeships and little else; on wider matters they are seldom heard.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'The guilds of the trades keep their own rules on work and apprentices; beyond that, their say is small.', needs: ['guild'], vantage: 'the trade', why: 'a guild stands' },
    { text: 'What the trades make is sold at the market on others\' terms; inside the workshops they set the standards, outside them they carry little weight.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
  ],
  'Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.': [
    { text: 'The craft guilds set the rules for their own work and apprentices, and are a steady second voice in the place\'s affairs.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'Craft masters regulate their own trades and train their own apprentices, and are reliably heard, if seldom first, in civic life.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'Anyone who wants to learn a trade here goes through the craft guilds, which also hold a steady, secondary place in civic life.', vantage: 'the newcomer', why: 'the line\'s own claim (apprenticeships)' },
    { text: 'The craft guilds control what is made for the market and who may learn to make it; in civic matters they are a reliable second voice.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
  ],
  'Church institutions are well-embedded in civic life; their opinion on appointments, taxation, and law is sought and usually influential.': [
    { text: 'Few appointments, taxes or laws are settled here without first hearing the church, and its view usually carries.', needs: ['church'], vantage: 'the official', why: 'the line\'s own claim; a church stands' },
    { text: 'The church is woven into civic life here; on appointments, taxes and the law its opinion is asked for and usually heeded.', needs: ['church'], vantage: 'the local', why: 'the line\'s own claim; a church stands' },
    { text: 'The council asks the church\'s view on appointments, taxes and law, and usually follows it.', needs: ['church', 'ruling body'], vantage: 'the official', why: 'a church; the seat is a body of more than one' },
    { text: 'Anyone seeking an office or a change in the law here soon learns to ask the church first; its opinion is usually influential.', needs: ['church'], vantage: 'the newcomer', why: 'the line\'s own claim; a church stands' },
    { text: 'The faith\'s opinion is sought on appointments, taxes and the law here, and it is usually heeded.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'In a place this size the church is part of civic life, and its opinion on appointments, taxes and law is sought and usually followed.', needs: ['church', 'population: middling'], vantage: 'the local', why: 'a church; a middling place (populationBand.js)' },
  ],
  'Town watch; it enforces ordinances, manages disorder, and reports to the council.': [
    { text: 'The town watch keeps the ordinances and the peace, and answers to the council.', needs: ['watch', 'ruling body'], vantage: 'the official', why: 'the line\'s declared watch; the seat is a council' },
    { text: 'The watch keeps the streets and the walls, enforces the ordinances and answers to those who govern.', needs: ['watch', 'walls'], vantage: 'the watch', why: 'the watch; the place has walls' },
    { text: 'The watch makes the arrests and brings them before the court, and answers to those who govern.', needs: ['watch', 'court sits'], vantage: 'the official', why: 'the watch; a court sits' },
    { text: 'A paid watch enforces the ordinances and handles disorder, and answers to those who govern.', needs: ['watch', 'paid watch'], vantage: 'the watch', why: 'the watch; someone is paid to keep order (guardPay.js)' },
    { text: 'The watch keeps order in the streets and at the market, enforces the ordinances, and answers to those who govern.', needs: ['watch', 'market'], vantage: 'the local', why: 'the watch; the place keeps a market' },
    { text: 'The watch enforces the ordinances and deals with disorder, and answers to those who govern.', needs: ['watch'], vantage: 'the official', why: 'the line\'s declared watch' },
    { text: 'In a place this size the watch is the law most people meet: it enforces the ordinances, handles disorder and answers to those who govern.', needs: ['watch', 'population: middling'], vantage: 'the local', why: 'a middling place' },
  ],
  'City watch; it answers for keeping order and is growing more sure of its own authority.': [
    { text: 'The city watch keeps order and knows it is needed, and it is growing more sure of its own authority.', needs: ['watch'], vantage: 'the official', why: 'the line\'s declared watch' },
    { text: 'The watch that keeps the streets and the walls is growing more sure of its own authority.', needs: ['watch', 'walls'], vantage: 'the watch', why: 'the place has walls' },
    { text: 'The watch brings lawbreakers in and the court deals with them; the watch is growing more sure of its own authority.', needs: ['watch', 'court sits'], vantage: 'the official', why: 'a court sits' },
    { text: 'Keeping order in a place this large falls to the watch, and it is growing more sure of its own authority.', needs: ['watch', 'population: large'], vantage: 'the local', why: 'a large place' },
    { text: 'The watch answers for order in the streets, and is more sure of its own authority than it used to be.', needs: ['watch'], vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'Order inside the walls is the watch\'s to keep and the defence is the garrison\'s; the watch is growing more sure of its own authority.', needs: ['watch', 'walls', 'garrison'], vantage: 'the watch', why: 'walls and a garrison stand' },
  ],
  'City watch; law enforcement and external defence, stretched between multiple responsibilities.': [
    { text: 'The city watch keeps the law in the streets and helps hold the walls, and is stretched between the two.', needs: ['watch', 'walls'], vantage: 'the watch', why: 'the place has walls' },
    { text: 'The watch keeps the law and shares the defence with the garrison, and is stretched between the two.', needs: ['watch', 'garrison'], vantage: 'the watch', why: 'a garrison stands' },
    { text: 'In a place this large the watch has the streets to police and the defence to see to, and is stretched between them.', needs: ['watch', 'population: large'], vantage: 'the local', why: 'a large place' },
    { text: 'The watch arrests for the court and stands to the defence when needed, stretched between the two.', needs: ['watch', 'court sits'], vantage: 'the official', why: 'a court sits' },
  ],
  'A second armed company that wants a share of keeping order here, and of the say that goes with it.': [
    { text: 'A second armed company; it wants a share of the policing here, and a voice to match.', vantage: 'the watch', why: 'the density law\'s own line (a second claimant on the niche)' },
    { text: 'A rival armed company that contests the established force\'s hold on keeping order here, and wants the say that goes with it.', vantage: 'the official', why: 'the density law\'s own line (contestsNiche)' },
    { text: 'In a place this large there is room for more than one armed company, and this one wants a share of keeping order and of the say that goes with it.', needs: ['population: large'], vantage: 'the local', why: 'a large place' },
  ],
  "A mayor runs the town's day-to-day business.": [
    { text: "The town's daily business is the mayor's to run.", vantage: 'the official', why: 'the seat\'s own claim (one office)' },
    { text: 'Anything that needs doing in the town goes to the mayor, who runs its day-to-day business.', vantage: 'the local', why: 'the seat\'s own claim' },
    { text: "The mayor runs the town's day-to-day business, from the market to the streets.", needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: "The mayor sees to the town's day-to-day business; the hard cases go to the court.", needs: ['court sits'], vantage: 'the official', why: 'a court sits: the judging is not the mayor\'s (one hat)' },
  ],
  'An elected or appointed council governs; merchants, guilds, and prominent families compete for seats.': [
    { text: 'The place is governed by its council, and its seats are sought by merchants, guild masters and the leading families.', vantage: 'the official', why: 'the seat\'s own claim' },
    { text: 'Seats on the council that governs here are prized, and merchants, guildsmen and the old families all compete for them.', vantage: 'the local', why: 'the seat\'s own claim' },
    { text: 'The council governs, and the guilds and the leading families both work to fill its seats.', needs: ['guild'], vantage: 'the trade', why: 'a guild stands' },
  ],
  'The guilds govern together; the richer the guild, the more say it has.': [
    { text: 'The guilds govern together, and the richest of them have the most say.', vantage: 'the official', why: 'the seat\'s own claim' },
    { text: "Government here is the guilds' together; a guild's say rises with its wealth.", vantage: 'the trade', why: 'the seat\'s own claim' },
    { text: 'The guilds that trade at the market also govern the place together, and the richer guilds speak loudest.', needs: ['market'], vantage: 'the local', why: 'the place keeps a market' },
  ],
  'A full council governs the city: aldermen, guild masters and appointed officials see to its taxes, its laws and its streets.': [
    { text: 'Taxes, laws and street repairs all come from the city council, a body of aldermen, guild masters and appointed officials.', vantage: 'the local', why: 'the seat\'s own claim' },
    { text: 'A full council of aldermen, guild masters and appointed officials governs the city; it sets the taxes and the laws, and the courts judge by them.', needs: ['court sits'], vantage: 'the official', why: 'a court sits' },
    { text: 'The city council, aldermen, guild masters and officials together, keeps the taxes, the laws, the streets and the walls.', needs: ['walls'], vantage: 'the watch', why: 'the place has walls' },
    { text: 'The council of aldermen, guild masters and officials governs the city, from the taxes and laws down to the streets and the market.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
  ],
  'A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; the council is always split into camps, and real power shifts between blocs.': [
    { text: 'The metropolis is governed by a grand council of officials, guild masters and appointed magnates, divided into camps; power moves between them.', vantage: 'the official', why: 'the seat\'s own claim' },
    { text: 'Senior officials, guild masters and appointed magnates sit together on the grand council that governs; its camps rarely agree, and the balance between them keeps shifting.', vantage: 'the local', why: 'the seat\'s own claim' },
  ],
  "A formal consortium of the metropolis's most powerful guild masters holds civic authority; membership in the consortium is itself a prize.": [
    { text: 'The most powerful guild masters govern together as a formal consortium, and a place in it is much sought after.', vantage: 'the official', why: 'the seat\'s own claim' },
    { text: 'Civic authority belongs to a consortium of the leading guild masters; to join it is the ambition of many a lesser guild.', needs: ['guild'], vantage: 'the trade', why: 'a guild stands' },
  ],
  'Minor landed families with limited political reach; present in civic life but rarely decisive.': [
    { text: 'The landed families here are part of civic life, but their reach is limited and their voice rarely decides anything.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'Old landed families with modest holdings; they take part in civic affairs, but are seldom the ones who settle them.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'Landed families of no great weight: present in civic life, rarely decisive in it.', vantage: 'the official', why: 'the line\'s own claim' },
    { text: 'In a place this large the old landed families are a minor voice; they take part in civic life but rarely decide it.', needs: ['population: large'], vantage: 'the newcomer', why: 'a large place' },
  ],
  'Established merchant community; fund civic works and expect council access in return.': [
    { text: 'The established merchants pay toward civic works and expect a hearing at the council in return.', vantage: 'the official', why: 'the line\'s own claim (claimStanding.js keeps the council\'s word only where a council sits)' },
    { text: 'A settled merchant community that helps pay for civic works and, in return, expects the council to listen.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'The merchants who keep the market are well established; they fund civic works and expect the council\'s ear in return.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'Merchants long established in what the place sends out; they help pay for civic works and expect access to the council in return.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list' },
  ],
  'Established merchant community; fund civic works and expect access to the hall in return.': [
    { text: 'The established merchants pay toward civic works and expect a hearing in the hall in return.', vantage: 'the official', why: 'the line\'s own claim (the hall: no council sits, SEAT_WORDS)' },
    { text: 'A settled merchant community that helps pay for civic works and, in return, expects the hall to listen.', vantage: 'the local', why: 'the line\'s own claim' },
    { text: 'The merchants who keep the market are well established; they fund civic works and expect the hall\'s ear in return.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
    { text: 'Merchants long established in what the place sends out; they help pay for civic works and expect access to the hall in return.', needs: ['exports'], vantage: 'the trade', why: 'the place has an export list' },
  ],
  'A consortium of guild masters holds power; policy is shaped by trade interests and inter-guild bargaining.': [
    { text: 'Guild masters govern together here; policy follows trade, and is settled by bargaining between the guilds.', vantage: 'the official', why: 'the seat\'s own claim' },
    { text: 'The guild masters who govern decide policy by the needs of trade and by what the guilds can agree among themselves.', vantage: 'the trade', why: 'the seat\'s own claim' },
  ],
};

/**
 * THE STANDING CODAS (factionStanding.js :: annotateFactionStanding, the sentences appended after a description's opening).
 * Proposed as a SECOND, separable step (the proposal's §6 asks the chair whether the bar counts the stored leaf, as the
 * instrument does, or the sentence): each coda is matched where it stands in a description (a pattern over its own words;
 * $1, $2 are the names or the force word it already carries) and picked by its own key
 * '<record _seed>::powerStructure.factions.desc::<the power's name>::<coda id>'. Index 0 is the coda as it stands.
 * @type {ReadonlyArray<{ id: string, re: string, variants: Variant[] }>}
 */
export const CODA_POOLS = [
  { id: 'atTable', re: 'They are always at the table, but cannot set their own terms\\.', variants: [
    { text: 'They are part of every bargain, but never the ones who set its terms.', vantage: 'the official', why: 'the coda\'s own claim (rank 2, gaps as the writer reads them)' },
    { text: 'Nothing is settled without them in the room, and nothing on their terms alone.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'They are always consulted, and seldom get their own way.', vantage: 'the newcomer', why: 'the coda\'s own claim' },
    { text: 'They always have a voice when the council bargains, but never the deciding one.', needs: ['ruling body'], vantage: 'the official', why: 'the seat is a body of more than one' },
  ] },
  { id: 'bodiesMinds', re: 'They and the religious authorities both keep people in line\\. The ([a-z ]+?) deals with bodies and the clergy with minds, and each wishes the other would keep quieter\\.', variants: [
    { text: 'They and the clergy both keep order, one in the streets and one in people\'s heads, and each would like the other to say less.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'The $1 keeps order with its hands and the clergy with their sermons; each finds the other too loud.', vantage: 'the watch', why: 'the coda\'s own claim; the force word it already carries' },
    { text: 'Between them, the $1 and the religious authorities keep people in line, the one by force and the other by conscience, and neither enjoys sharing the work.', vantage: 'the official', why: 'the coda\'s own claim' },
  ] },
  { id: 'arcaneInShadow', re: 'The arcane orders are present but operate in the clergy\'s shadow\\. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved\\.', variants: [
    { text: 'The arcane orders work in the clergy\'s shadow here, and no one has settled which magic the faith allows and which it does not.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'The clergy stand above the arcane orders here; what counts as permitted magic and what as heresy is left, on purpose, unsaid.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'The church outweighs the arcane orders here, and leaves the line between sanctioned magic and heresy undrawn, by choice.', needs: ['church'], vantage: 'the newcomer', why: 'a church stands' },
  ] },
  { id: 'clergyAhead', re: 'The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly\\.', variants: [
    { text: 'With the clergy ahead of them in public affairs, the arcane orders keep out of their way and never cross them openly.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'The arcane orders defer to the clergy in public and pursue their own business quietly.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'Where the church speaks on public matters, the arcane orders keep silent and go their own way around it.', needs: ['church'], vantage: 'the newcomer', why: 'a church stands' },
  ] },
  { id: 'outvoted', re: 'The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal\\.', variants: [
    { text: 'On prices and labour the merchants outvote them every time, so the craft masters bargain for what they can, deal by deal.', vantage: 'the trade', why: 'the coda\'s own claim' },
    { text: 'Outvoted on prices and on the terms of work, the craft masters fight their corner in the small print of each deal.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'The merchants decide the prices at the market and the terms of work; the craft masters win what they can by adding conditions to each deal.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
  ] },
  { id: 'outpaced', re: 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not\\.', variants: [
    { text: 'The craft guilds have a voice, but a smaller one: the merchants set prices, the craft masters object, and the merchants usually prevail.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'Merchants set the prices and the craft guilds argue; more often than not, the merchants win.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'At the market the merchants set the prices, the craft masters object, and the merchants win more often than not.', needs: ['market'], vantage: 'the trade', why: 'the place keeps a market' },
  ] },
  { id: 'worthBuying', re: 'Close enough to the two above that their support is worth buying; they play (.+?) and (.+?) against each other when they can\\.', variants: [
    { text: 'Third in weight, they sell their support dearly, and play $1 and $2 against each other whenever they can.', vantage: 'the official', why: 'the coda\'s own claim (the third power, as the writer ranks it)' },
    { text: 'Their support is worth buying, and both $1 and $2 know it; they play one against the other when they can.', vantage: 'the local', why: 'the coda\'s own claim' },
  ] },
  { id: 'inShadow', re: 'They operate in the shadow of (.+?), close enough to matter and too far behind to lead\\.', variants: [
    { text: 'Second to $1, they matter, but they are too far behind to lead.', vantage: 'the official', why: 'the coda\'s own claim (rank 1)' },
    { text: 'They count for something here, but $1 counts for more, and the gap is too wide to close.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: 'Close enough to $1 to matter, not close enough to lead.', vantage: 'the newcomer', why: 'the coda\'s own claim' },
  ] },
  { id: 'narrowGap', re: 'The gap between them and (.+?) is narrow\\. A single shift in patronage, scandal, or armed muscle could swap their positions\\.', variants: [
    { text: 'Only a little separates them from $1; one change of patron, one scandal or one show of force could reverse the order.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'They stand just behind $1, near enough that a single scandal or a lost patron could put them ahead.', vantage: 'the local', why: 'the coda\'s own claim' },
    { text: '$1 leads them, but narrowly; the order of the two could turn on one scandal or one change of allegiance.', vantage: 'the newcomer', why: 'the coda\'s own claim' },
  ] },
  { id: 'closingGap', re: 'The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down\\.', variants: [
    { text: 'Merchant money is catching up with them, and the noble families use every law and every connection they have to hold it back.', vantage: 'the official', why: 'the coda\'s own claim' },
    { text: 'The noble families feel the merchants closing on them, and use law and connection alike to slow them.', vantage: 'the local', why: 'the coda\'s own claim' },
  ] },
];
