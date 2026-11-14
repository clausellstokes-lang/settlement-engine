/**
 * power/conflictIssues.js — THE QUARRELS' ISSUES, EACH WITH ITS CAST (COHERENCE-QUARREL,
 * 2026-11-11; the chair's charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3).
 *
 * THE DEFECT (class III). An issue was drawn without regard to who the two powers are: on 360
 * settlements, "Military conscription of guild apprentices" stood between a Town Council and the
 * Landed Gentry, with no guild and no soldier among the parties, in 90 of its 102 uses.
 *
 * THE CAST. Every issue declares the kinds of power it needs among its two parties. `cast` is a
 * list of SLOTS; each slot is the kinds that may fill it, and each slot is filled by a different
 * party. An empty cast is any two powers. A power's kinds are read off its own row
 * (`kindsOfPower`): its category, `governing` for the ruling power, and `council` for a power
 * whose name says it sits as one.
 *
 * `touches` names the kinds of power an issue reaches that need not be a party (the craft guilds,
 * in a conscription quarrel). `needs` is the pool census's declaration (`drawDeclared`): a thing
 * the town must have for the line to stand.
 *
 * DATA ONLY, apart from the two pure readers at the foot.
 */

/** The kinds a cast may name: the power categories, and two read off the row. */
export const CAST_KINDS = Object.freeze([
  'government', 'economy', 'religious', 'military', 'noble', 'magic', 'criminal', 'other',
  'governing', 'council',
]);

/** Who rules, or who could: the ruling power, a government power, or a council. */
const RULE = Object.freeze(['governing', 'government', 'council']);

/**
 * @typedef {object} ConflictIssue
 * @property {string} id the issue's stable id in the draw's ledger (its text, or the text it was first written with)
 * @property {string} issue the issue, as the record stores it
 * @property {string} stakes what is at stake, as the record stores it
 * @property {string | null} flag a stress flag the issue waits on, or none
 * @property {'magic' | 'water_trade'} [requires] a world law the issue waits on
 * @property {ReadonlyArray<ReadonlyArray<string>>} cast the slots its two parties must fill
 * @property {ReadonlyArray<string>} [touches] kinds of power it reaches that need not be a party
 * @property {RegExp} [touchesFirst] among the touched powers, the names it reaches first (apprentices are the crafts')
 * @property {ReadonlyArray<string>} [needs] things the town must have (the pool census's atoms)
 * @property {ReadonlyArray<string>} [hooks] the issue's own plot hooks (one is drawn per quarrel)
 */

/** @type {ReadonlyArray<ConflictIssue>} the issues every town may draw */
export const BASE_ISSUES = Object.freeze(/** @type {Array<Omit<ConflictIssue, 'id'>>} */ ([
  // ── the issues the town has always drawn ──────────────────────────────────────────────
  { issue: 'Control of the market licensing process', stakes: 'Commercial supremacy', flag: null, cast: [['economy', ...RULE]], needs: ['market'], hooks: [
    'A stallholder who lost a licence last month wants to know who was paid to take it.',
    'Two licences have been granted for the same pitch, and both holders mean to set up on market day.',
  ] },
  { issue: 'Jurisdiction over a disputed arrest', stakes: 'Institutional authority', flag: 'stateCrime', cast: [['military', ...RULE]], hooks: [
    'The prisoner has not been charged by either side, and the family wants someone to find out where he is held.',
    'Each side has a written order for the same man, and the orders contradict each other.',
  ] },
  { issue: 'Church land claims on guild property', stakes: 'Institutional power', flag: 'theocraticEconomy', cast: [['religious'], ['economy']], needs: ['guild'], hooks: [
    'An old deed has turned up that would settle the claim, and someone is offering to sell it to the highest bidder.',
    'Workmen sent by one side to fence the land were turned away by the other at dawn.',
  ] },
  { issue: 'Arcane research permit regulations', stakes: 'Magical autonomy', flag: 'heresySuppression', requires: 'magic', cast: [['magic']], hooks: [
    'A permit was refused, and the work went on anyway in a cellar nobody admits to owning.',
    'Someone wants proof that the inspector who refuses the permits is being paid to refuse them.',
  ] },
  { issue: 'Control of the dock taxation authority', stakes: 'Port revenue', flag: null, requires: 'water_trade', cast: [['economy', ...RULE]], needs: ['docks'], hooks: [
    'A boat has been held at the quay for three days because two collectors both demand the duty.',
    'The tax books for last season are missing, and each side says the other took them.',
  ] },
  { issue: 'Military conscription of guild apprentices', stakes: 'Labor control', flag: null, cast: [['military', 'governing']], touches: ['economy'], touchesFirst: /\bcraft/i, needs: ['guild'], hooks: [
    'An apprentice named on the list has gone into hiding, and his master is being questioned.',
    'A master craftsman will pay well to have his best apprentice struck from the list.',
    'The list was drawn up overnight, and some of the names on it belong to boys who are not apprentices at all.',
  ] },
  { issue: "Access to the criminal network's intelligence", stakes: 'Operational advantage', flag: 'merchantCriminalBlur', cast: [], touches: ['criminal'], hooks: [
    'A go-between who carries word from the criminal network has stopped turning up, and both sides think the other has him.',
    'Someone is selling the same piece of news to both sides, and it cannot be true for both.',
  ] },
  { issue: 'Succession to a council seat', stakes: 'Political influence', flag: null, cast: [['council']], hooks: [
    'The vote on the empty seat is in four days, and two of the voters have not been seen since the last meeting.',
    'A will left by the last holder of the seat names an heir that neither side will accept.',
    'Someone has offered to swing the vote, and wants payment before the count.',
  ] },
  { issue: 'A mercenary contract being disputed by both parties', stakes: 'Military contract rights', flag: 'merchantArmy', cast: [['military', 'economy']], needs: ['mercenary'], hooks: [
    'The company has not been paid, and its captain has given both sides a week.',
    'Two copies of the contract exist, and the terms on them are not the same.',
  ] },
  { issue: 'Control of a key trade route checkpoint', stakes: 'Economic leverage', flag: null, cast: [['economy', 'military', 'noble', ...RULE]], hooks: [
    'Carters are waiting at the post because two sets of men each claim the right to collect the toll.',
    'A wagon was waved through without paying, and each side says the other let it go.',
    'The post burned down last week, and both sides want it rebuilt by their own people.',
  ] },

  // ── the issues any two powers can quarrel over ────────────────────────────────────────
  { issue: 'Blame for a costly failure last season', stakes: 'Reputation', flag: null, cast: [], hooks: [
    'A witness to what went wrong is willing to talk, but only to someone neither side can lean on.',
    'A letter that would settle who was to blame is in a strongbox, and the key has gone missing.',
  ] },
  { issue: 'An unpaid debt between the two powers', stakes: 'Money and face', flag: null, cast: [], hooks: [
    'The debt is due at the end of the month, and the man who signed for it has gone away.',
    'A moneylender has bought the debt and means to collect it from whichever side pays first.',
  ] },
  { issue: 'Ownership of a disputed building', stakes: 'Property', flag: null, cast: [], hooks: [
    'Both sides have changed the locks on the building, and a third party has been living in it all winter.',
    'The only copy of the deed is held by an old clerk who will not say which side he favours.',
  ] },
  { issue: 'Members leaving one power for the other', stakes: 'Loyalty and numbers', flag: null, cast: [], hooks: [
    'Three members crossed over in a single week, and the side they left wants to know what they were offered.',
    'A member who crossed over wants to go back, and needs someone to carry the message quietly.',
  ] },
  { issue: 'Precedence at public gatherings', stakes: 'Standing', flag: null, cast: [], hooks: [
    'The order of the next procession has not been settled, and both sides have said they will walk first.',
    'Someone has been paid to start a scuffle at the next feast, and nobody knows which side paid.',
  ] },
  { issue: 'A broken promise of support', stakes: 'Trust', flag: null, cast: [], hooks: [
    'The promise was made in writing, and the paper is now in the hands of someone who wants a price for it.',
    'The man who made the promise says he was told to break it, and will not say by whom.',
  ] },
  { issue: 'Who speaks for the place to outsiders', stakes: 'Outside influence', flag: null, cast: [], hooks: [
    'A visitor from a neighbouring place has been given two different answers, and wants to know which one is true.',
    'Both sides have written to the same neighbour, and the letters say opposite things.',
  ] },
  { issue: 'An informer planted by one power in the other', stakes: 'Secrets', flag: null, cast: [], hooks: [
    'The informer has asked for help getting out before he is found.',
    'A list of names has gone missing, and whoever has it knows who the informer is.',
  ] },

  // ── the issues of trade ───────────────────────────────────────────────────────────────
  { issue: 'Weights and measures used in trade', stakes: 'Honest dealing', flag: null, cast: [['economy']], hooks: [
    'A set of short weights has been found, and each side says the other made them.',
    'Someone wants the common measures tested by a person neither side has paid.',
  ] },
  { issue: 'Prices set on everyday goods', stakes: 'Livelihoods', flag: null, cast: [['economy']], hooks: [
    'Bread went up twice this month, and a baker says he was told to raise it.',
    'A sellers\' agreement on prices has been written down, and a copy of it would ruin whoever signed it.',
  ] },
  { issue: 'Who may take on apprentices', stakes: "The trades' future", flag: null, cast: [['economy']], hooks: [
    'A boy has been taken on by two masters at once, and his father has signed for both.',
    'A master who took on too many apprentices is being watched by someone who wants to report him.',
  ] },
  { issue: 'A loan called in early', stakes: 'Solvency', flag: null, cast: [['economy']], hooks: [
    'The borrower says the lender agreed to wait, and the only witness has been paid to forget it.',
    'If the loan is paid, a workshop closes; someone wants it paid by any means.',
  ] },
  { issue: 'Rights to the best market stalls', stakes: 'Custom', flag: null, cast: [['economy']], needs: ['market'], hooks: [
    'A good stall has been taken over by night, and its holder wants it back before market day.',
    'Someone is moving stall markers after dark, and both sides have set a man to watch.',
  ] },
  { issue: 'Who buys the raw materials first', stakes: 'Supply', flag: null, cast: [['economy']], hooks: [
    'A whole load of goods was bought on the road before it arrived, and nobody will say who paid for it.',
    'A supplier has promised the same load to both sides and taken money from each.',
  ] },
  { issue: 'Rules of the trade, and who has broken them', stakes: 'Trade rights', flag: null, cast: [['economy'], ['economy']], hooks: [
    'A piece of work made against the rules has been put on show, and the maker will not say who ordered it.',
    'An old book of trade rules has been found, and it says something neither side expected.',
  ] },
  { issue: 'Goods sold below the agreed price', stakes: 'Market share', flag: null, cast: [['economy'], ['economy']], hooks: [
    'Someone is selling at a loss every week, and the money to cover it is coming from somewhere.',
    'A buyer has been offered a lower price in secret, and the offer was written down.',
  ] },
  { issue: 'Trading on holy days', stakes: 'Custom and income', flag: null, cast: [['religious'], ['economy']], hooks: [
    'A shop opened on the last holy day and was stoned that night; the owner wants to know who threw the first one.',
    'A preacher has named three traders from the pulpit, and one of them has asked for protection.',
  ] },
  { issue: 'Tithes owed on trade', stakes: 'Revenue', flag: null, cast: [['religious'], ['economy']], hooks: [
    'The tithe collector has been keeping two sets of accounts, and one of them is missing.',
    'A trader who refused to pay the tithe has found his goods spoiled.',
  ] },
  { issue: 'Protection money taken from traders', stakes: 'Safety of trade', flag: null, cast: [['criminal'], ['economy']], hooks: [
    'A trader who stopped paying has had his shutters broken twice, and wants to know who gave the order.',
    'The man who collects the money wants out, and is offering what he knows in return for help.',
  ] },
  { issue: 'Stolen goods sold openly', stakes: 'Reputation and profit', flag: null, cast: [['criminal']], hooks: [
    'A merchant has found his own stolen cloth for sale two streets away.',
    'Someone wants a list of who has been buying the stolen goods, and will pay for each name.',
  ] },
  { issue: 'Payment for spellwork done and disputed', stakes: 'Payment and pride', flag: null, requires: 'magic', cast: [['magic']], hooks: [
    'The spell was paid for and did not work, or it worked and someone wants it to look as though it did not.',
    'A charm sold to one side has started to fail, and the seller has gone away.',
  ] },

  // ── the issues of the other kinds of power ────────────────────────────────────────────
  { issue: 'Who commands when danger comes', stakes: 'Command', flag: null, cast: [['military']], hooks: [
    'At the last alarm two sets of orders were given, and the men did not know whom to obey.',
    'A plan of the defences has been copied, and someone wants to know who has the copy.',
  ] },
  { issue: 'The cost of keeping the guard', stakes: 'Who pays for defence', flag: null, cast: [['military'], ['economy', ...RULE]], needs: ['guardPresence'], hooks: [
    'The guard has not been paid this month, and some of them have started taking payment in kind.',
    'A tally of what the guard costs has been drawn up, and the numbers on it do not add up.',
  ] },
  { issue: 'Punishment of a member who struck a local man', stakes: 'Honour and order', flag: null, cast: [['military']], hooks: [
    'The man who was struck has not been seen since, and his family wants him found.',
    'The member has been hidden by his own side, and the other side is offering a reward.',
  ] },
  { issue: 'A preacher who denounces the other power', stakes: 'Public opinion', flag: null, cast: [['religious']], hooks: [
    'The preacher has been told to stop, and says he will speak again on the next holy day.',
    'Someone is paying the crowd that gathers to hear the preacher, and it is not his own side.',
  ] },
  { issue: 'Rites refused to members of the other power', stakes: 'Good standing', flag: null, cast: [['religious']], hooks: [
    'A dead man has lain unburied for two days because the rite was refused, and his family is angry.',
    'A wedding has been called off because the priest will not perform it.',
  ] },
  { issue: 'Who keeps the register of births and deaths', stakes: 'Records and fees', flag: null, cast: [['religious']], hooks: [
    'A page of the register has been cut out, and it held the birth of someone with a claim to property.',
    'Two registers now exist, and they do not agree on who is dead.',
  ] },
  { issue: 'Rents and dues owed on land', stakes: 'Land income', flag: null, cast: [['noble']], hooks: [
    'Tenants have stopped paying until the quarrel is settled, and the steward has been told to make an example.',
    'The old boundary stones have been moved, and someone knows where they used to stand.',
  ] },
  { issue: 'A broken betrothal', stakes: 'Family honour', flag: null, cast: [['noble']], hooks: [
    'The betrothal was ended by letter, and one family says the letter is forged.',
    'The jilted family wants the dowry back, and the other has already spent it.',
  ] },
  { issue: 'Magic used in public without leave', stakes: 'Public safety', flag: null, requires: 'magic', cast: [['magic']], hooks: [
    'A spell went wrong in the street last week, and both sides blame someone the other trained.',
    'Someone wants proof of who cast it, and is offering good money for it.',
  ] },
  { issue: 'A member held by the other side', stakes: 'Loyalty', flag: null, cast: [['criminal']], hooks: [
    'The captive has sent out a message asking for help, and it is not clear which side let it out.',
    'A price for the captive\'s release has been named, and it is more than money.',
  ] },
  { issue: 'An account of public money', stakes: 'Trust in office', flag: null, cast: [[...RULE]], hooks: [
    'A clerk has found a sum missing from the accounts and is afraid to say so out loud.',
    'Someone wants the accounts copied before they can be changed.',
  ] },
  { issue: 'The right to raise a new levy', stakes: 'Revenue', flag: null, cast: [[...RULE]], hooks: [
    'Notice of the new levy has been torn down every morning this week.',
    'A household that refused the levy has had its door marked, and wants to know who marked it.',
  ] },
  // COHERENCE-POWERS-8 (round three #337, HIGH: "A ruling one power refuses to obey" lacked its "that"): the issue reads
  // whole; its id stays the old text, so the draw's ledger and the quarrel's hook hash (conflicts.js) keep their key
  { id: 'A ruling one power refuses to obey', issue: 'A ruling that one power refuses to obey', stakes: 'Authority', flag: null, cast: [[...RULE]], hooks: [
    'The ruling was given in writing, and the copy that was posted is not the one that was signed.',
    'A man sent to enforce the ruling was turned away, and has asked for others to go with him.',
  ] },
]).map((row) => Object.freeze({ id: row.issue, ...row })));

/** @type {Readonly<Record<string, ReadonlyArray<ConflictIssue>>>} the issues a stress type opens */
export const STRESS_ISSUES = Object.freeze(Object.fromEntries(Object.entries(/** @type {Record<string, Array<Omit<ConflictIssue, 'id'>>>} */ ({
  wartime: [
    { issue: 'Rights to a lucrative war supply contract', stakes: 'Economic windfall', flag: null, cast: [['economy']] },
    { issue: 'Authority over military conscription lists', stakes: 'Labour and loyalty control', flag: null, cast: [['military', ...RULE]] },
    { issue: 'Control of the requisition enforcement apparatus', stakes: 'Political leverage', flag: null, cast: [['military', ...RULE]] },
  ],
  insurgency: [
    { issue: 'Legitimacy of the current governing authority', stakes: 'Political survival', flag: null, cast: [], touches: ['governing'] },
    { issue: 'Whether to open back-channel negotiations with the insurgency', stakes: 'Settlement stability', flag: null, cast: [] },
    { issue: 'Control of the intelligence on insurgent cells', stakes: 'Operational advantage', flag: null, cast: [['military', 'criminal', ...RULE]] },
  ],
  mass_migration: [
    { issue: 'Allocation of housing and resources between established residents and newcomers', stakes: 'Social cohesion', flag: null, cast: [] },
    { issue: 'Control of the documentation and registration process for new arrivals', stakes: 'Legal and financial leverage', flag: null, cast: [['religious', ...RULE]] },
  ],
  religious_conversion: [
    { issue: "Custody of the settlement's religious records and property", stakes: 'Institutional legitimacy', flag: null, cast: [['religious']] },
    { issue: 'Whether the governing authority should formally declare a religious allegiance', stakes: 'Political and legal authority', flag: null, cast: [['religious']], touches: ['governing'] },
  ],
  slave_revolt: [
    { issue: 'Whether to suppress, contain, or negotiate with the revolt leadership', stakes: 'Settlement order and precedent', flag: null, cast: [] },
    { issue: 'Accountability for the conditions that produced the revolt', stakes: 'Political survival', flag: null, cast: [] },
    { issue: 'Control of the escape routes and networks supporting the revolt', stakes: 'Security and leverage', flag: null, cast: [['military', 'criminal', ...RULE]] },
  ],
  occupied: [
    { issue: 'Degree of collaboration with the occupying authority', stakes: 'Survival vs dignity', flag: null, cast: [] },
  ],
  famine: [
    { issue: 'Control of the remaining grain stores', stakes: 'Survival', flag: null, cast: [] },
  ],
})).map(([type, rows]) => [type, Object.freeze(rows.map((row) => Object.freeze({ id: row.issue, ...row })))])));

/** A name that says its power sits as a council. */
const COUNCIL_NAME = /\b(?:council|senate|assembly)\b/i;

/**
 * The kinds of power one power row answers for. Pure.
 * @param {{ name?: unknown, category?: unknown, isGoverning?: unknown } | null | undefined} power
 * @returns {Set<string>}
 */
export function kindsOfPower(power) {
  const kinds = new Set();
  if (typeof power?.category === 'string' && power.category) kinds.add(power.category);
  if (power?.isGoverning === true) kinds.add('governing');
  if (typeof power?.name === 'string' && COUNCIL_NAME.test(power.name)) kinds.add('council');
  return kinds;
}

/**
 * Do two powers fill an issue's cast? Each slot is filled by a different party. Pure.
 * @param {{ cast?: ReadonlyArray<ReadonlyArray<string>> }} issue
 * @param {Set<string>} kindsA @param {Set<string>} kindsB
 * @returns {boolean}
 */
export function castFilled(issue, kindsA, kindsB) {
  const slots = Array.isArray(issue?.cast) ? issue.cast : [];
  const fills = (/** @type {Set<string>} */ kinds, /** @type {ReadonlyArray<string>} */ slot) => slot.some((k) => kinds.has(k));
  if (slots.length === 0) return true;
  if (slots.length === 1) return fills(kindsA, slots[0]) || fills(kindsB, slots[0]);
  return (fills(kindsA, slots[0]) && fills(kindsB, slots[1])) || (fills(kindsB, slots[0]) && fills(kindsA, slots[1]));
}
