/**
 * data/dailyLife/unspokenTopics.js — THE `unspoken_topics` POOLS (DAILY-1 `lines/L2/LINES-2.md` § 4, revised by
 * `lines/L2/LINES-2b.md` § 2, as the chair ruled: 18:47 (ruling 7: a crime wound falls to the next tension the record
 * holds; no hidden threat is said; `hidden.arcane_instability` cut) and 18:56 (ruling 11: every line declared in the
 * vocabulary's own atoms, `facts/factVocabulary.js`)).
 *
 * `UNSPOKEN_TOPICS`: one frozen array a branch, `wound.<type>` for each tension TYPE `data/historyData.js` can write
 * (`history.currentTensions[].type`), every line true of both the type's present form and its memory form (the
 * descriptions in the past tense the generator writes when the type's own event is old), and framed as what locals keep
 * from strangers or out of company. THE WOUND is `historyBeats.js :: deriveUnresolvedWound` (the record's first
 * tension); a crime wound (`crime_wave`, `corruption_scandal`: no pool, rule 6) falls to the first LATER tension the
 * record holds whose type has a pool; a wound with no pool, or a crime wound with no such tension after it, says
 * nothing: the EMPTY string (ruling 3; THE CALM RULE, never an invented topic). No hidden or rumoured threat is said
 * (ruling 7), and no corruption clause. A line is `{ id, text, needs }` as in `childWarnings.js`; the id is its number
 * in LINES-2 § 4. "The merchants", "buyers" need a market; "the guilds" a (non-criminal) guild. No line names a house by
 * its roster name, says "town" or needs a hideable house or a crime atom (`tests/domain/dailyLifeAtoms.test.js`, arm (c)).
 * The deriver (`domain/dailyLife.js :: deriveUnspokenTopics`) hands the branch's lines to `facts/drawDeclared.js ::
 * filterDeclared` and picks one by `kernel/proseHash.js :: pickVariantMixed` keyed
 * `<record.name>::dailyLife.unspoken_topics::wound.<type>`.
 *
 * NOT BUILT (a walker's reading whose cure is a rewording, the chair's; the style law strikes "a stranger", and its
 * ratchet only falls): guild_conflict #3 "The fight over trading rights is something people would rather a stranger did
 * not hear about.", resource_scarcity #2 "The shortage is on everyone's mind and on nobody's tongue when a stranger is
 * near.", legitimacy_crisis #3 "Nobody here will tell a stranger what they think of the present authority." and
 * wild_magic #2 "Those touched by the magic are not discussed in their hearing, or in a stranger's.". Each branch keeps
 * the rest.
 * NOT BUILT (the presumed-things walker reads "the occupation" / "the occupiers" as an occupation in force, which a
 * memory of one is not; the rewording the chair's): occupation_legacy #0 to #2. That wound has no line: it says nothing.
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string> }} UnspokenLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[] }>} lines @returns {ReadonlyArray<UnspokenLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({ ...l, needs: Object.freeze([...l.needs]) })));

/** The pools by branch (the wound's tension type → its lines). */
export const UNSPOKEN_TOPICS = Object.freeze({
  'wound.succession_crisis': frozen([
    { id: 'W0', text: 'Who should lead next is not something people discuss in front of strangers.', needs: [] },
    { id: 'W1', text: 'Nobody raises the succession in company; everyone already has a side.', needs: [] },
    { id: 'W2', text: 'Ask who will lead after the present rulers, and the talk turns to something else.', needs: [] },
    { id: 'W3', text: 'The old quarrel over who should rule is not aired before outsiders.', needs: [] },
  ]),
  'wound.economic_disparity': frozen([
    { id: 'W0', text: 'How much richer the merchants have grown than the labourers is not a thing to raise in mixed company.', needs: ['market'] },
    { id: 'W1', text: 'People keep quiet about who is getting richer and who is not, at least where they can be overheard.', needs: [] },
    { id: 'W2', text: 'The gap between those who prosper and those who labour is felt by all and spoken of by few.', needs: [] },
  ]),
  'wound.religious_tension': frozen([
    { id: 'W0', text: 'Which faith is the true one is a question people here keep to themselves.', needs: [] },
    { id: 'W1', text: 'Nobody argues about faith in company; the rivalry between the faiths runs too deep.', needs: [] },
    { id: 'W2', text: 'Matters of faith are left alone in mixed company, and for good reason.', needs: [] },
  ]),
  'wound.guild_conflict': frozen([
    { id: 'W0', text: 'The quarrel between the guilds and those outside them is not raised where both can hear.', needs: ['guild'] },
    { id: 'W1', text: 'Who may sell what, and who gets a say in how the place is run, is argued in private, not in public.', needs: [] },
    { id: 'W2', text: 'Traders here do not discuss the guild quarrel with customers, or with each other in public.', needs: ['guild'] },
    { id: 'W4', text: 'Nobody mentions the guilds\' quarrel in company unless they want an argument.', needs: ['guild'] },
    { id: 'W5', text: 'Ask a trader here who may sell what, and the conversation goes quiet.', needs: [] },
  ]),
  'wound.external_threat': frozen([
    { id: 'W0', text: 'How the place should answer the danger it has been warned of is argued in private, not before strangers.', needs: [] },
    { id: 'W1', text: 'Nobody here talks openly about whether to stand, bargain or leave if the danger comes.', needs: [] },
    { id: 'W2', text: 'The warning of danger has split people, and they do not air the split in company.', needs: [] },
  ]),
  'wound.resource_scarcity': frozen([
    { id: 'W0', text: 'What the place is short of, and who is to blame for it, is not discussed with strangers.', needs: [] },
    { id: 'W1', text: 'People do not talk openly about the shortage, least of all with outsiders.', needs: [] },
    { id: 'W3', text: 'Nobody asks a neighbour how they are managing for supplies; it is not a question to ask.', needs: [] },
    { id: 'W4', text: 'What is running short here is a sore subject, and visitors are not told much about it.', needs: [] },
  ]),
  'wound.magical_controversy': frozen([
    { id: 'W0', text: 'How far magic should be allowed is a question people do not raise in company.', needs: [] },
    { id: 'W1', text: 'Nobody wants to start the argument over magic again, so nobody mentions it.', needs: [] },
    { id: 'W2', text: 'Talk of magic, and of who should be allowed to use it, is kept away from strangers.', needs: [] },
  ]),
  'wound.generational_divide': frozen([
    { id: 'W0', text: 'The young and the old disagree about how things should be done, and they keep the quarrel at home.', needs: [] },
    { id: 'W1', text: 'Nobody sets the old ways against the new in mixed company; it only starts the quarrel again.', needs: [] },
    { id: 'W2', text: 'What the young want to change is a sore subject, and the old do not discuss it with outsiders.', needs: [] },
  ]),
  'wound.outside_debt': frozen([
    { id: 'W0', text: 'The debt owed to an outside power is not mentioned in front of visitors.', needs: [] },
    { id: 'W1', text: 'Nobody here likes to talk about what the place owes, or about who is coming to collect it.', needs: [] },
    { id: 'W2', text: 'What is owed to outsiders, and what happens when it is called in, is spoken of quietly if at all.', needs: [] },
  ]),
  'wound.infiltration_fear': frozen([
    { id: 'W0', text: 'Talk of enemy agents in the place is kept low, since nobody knows who is listening.', needs: [] },
    { id: 'W1', text: 'People are careful what they say about spies, and to whom.', needs: [] },
    { id: 'W2', text: 'Suspicion of hidden enemies runs deep, and nobody voices it in front of strangers.', needs: [] },
  ]),
  'wound.disputed_land': frozen([
    { id: 'W0', text: 'The old charter and the land it claims are not discussed with outsiders.', needs: [] },
    { id: 'W1', text: 'Whose land is whose, under the old charter or the present holding, is a question nobody raises lightly.', needs: [] },
    { id: 'W2', text: 'Nobody brings up the disputed land in company; both sides have a case and both know it.', needs: [] },
  ]),
  'wound.population_friction': frozen([
    { id: 'W0', text: 'The bad feeling between newcomers and the old families is not discussed in front of either.', needs: [] },
    { id: 'W1', text: 'People here keep quiet about the newcomers, at least where the newcomers can hear.', needs: [] },
    { id: 'W2', text: 'The friction between the established folk and the newer arrivals is felt more than it is spoken of.', needs: [] },
  ]),
  'wound.leadership_vacuum': frozen([
    { id: 'W0', text: 'Who will take a firm hold of the leadership is not a question asked aloud.', needs: [] },
    { id: 'W1', text: 'Nobody here talks openly about the lack of anyone firmly in charge.', needs: [] },
    { id: 'W2', text: 'The want of a strong hand at the top is felt by everyone and mentioned by few.', needs: [] },
  ]),
  'wound.market_crash': frozen([
    { id: 'W0', text: 'Talk of a coming crash is kept quiet, for fear that talk alone might bring it on.', needs: [] },
    { id: 'W1', text: 'Nobody wants to be heard talking about the crash, in case the talk itself sets it off.', needs: [] },
    { id: 'W2', text: 'Whether prices are about to fall is argued in private, never in front of buyers.', needs: ['market'] },
  ]),
  'wound.trade_collapse': frozen([
    { id: 'W0', text: 'The fate of the trade the place was built on is a sore subject, and strangers are not told much.', needs: [] },
    { id: 'W1', text: 'Nobody here likes to talk about the trade the place has lived by, or how it has fared.', needs: [] },
  ]),
  'wound.great_fire': frozen([
    { id: 'W0', text: 'Fire is the fear here, and people would rather not speak of it.', needs: [] },
    { id: 'W1', text: 'The old argument over fire, and who should bear the cost of preventing it, is not aired in company.', needs: [] },
    { id: 'W2', text: 'Nobody here talks lightly about fire, or about the damage it can do.', needs: [] },
  ]),
  'wound.plague_years': frozen([
    { id: 'W0', text: 'Sickness, and who should be shut away when it comes, is not talked of before strangers.', needs: [] },
    { id: 'W1', text: 'People here would rather not discuss fevers, or the quarrels they bring.', needs: [] },
    { id: 'W2', text: 'The fear of sickness is real, but nobody speaks of it in company.', needs: [] },
  ]),
  'wound.great_flood': frozen([
    { id: 'W0', text: 'The water, and who must keep it back, is a quarrel nobody airs in front of outsiders.', needs: [] },
    { id: 'W1', text: 'People here do not talk about the water if they can help it.', needs: [] },
    { id: 'W2', text: 'Who lost what to the water, and who should pay to keep it back, is left unsaid in company.', needs: [] },
  ]),
  'wound.heresy_trial': frozen([
    { id: 'W0', text: 'The charge of heresy against a prominent figure is not discussed where the faithful can hear.', needs: [] },
    { id: 'W1', text: 'Nobody takes sides on the heresy charge in public, whatever they think in private.', needs: [] },
    { id: 'W2', text: 'The heresy accusation has split the faithful, and people keep their opinions to themselves.', needs: [] },
  ]),
  'wound.pilgrimage_surge': frozen([
    { id: 'W0', text: 'Whether the miracle was real is a question people do not raise with strangers.', needs: [] },
    { id: 'W1', text: 'Nobody here argues about the miracle in company; feelings run too high.', needs: [] },
    { id: 'W2', text: 'The claimed miracle is a sore subject here, and strangers are not told much about it.', needs: [] },
  ]),
  'wound.popular_uprising': frozen([
    { id: 'W0', text: 'How hard the common people should press those in charge is argued in private, not in public.', needs: [] },
    { id: 'W1', text: 'Nobody talks openly about the people\'s grievances against those in charge, least of all to strangers.', needs: [] },
    { id: 'W2', text: 'The quarrel between the common people and those who rule them is not aired in public.', needs: [] },
  ]),
  'wound.tyranny': frozen([
    { id: 'W0', text: 'Whether one person is taking too much power is said only behind closed doors.', needs: [] },
    { id: 'W1', text: 'People here are careful how they speak of power and of who holds it.', needs: [] },
    { id: 'W2', text: 'Talk of tyranny is kept low, and never in front of strangers.', needs: [] },
  ]),
  'wound.legitimacy_crisis': frozen([
    { id: 'W0', text: 'Whether those in charge have any right to rule is not argued in front of outsiders.', needs: [] },
    { id: 'W1', text: 'People keep their doubts about the present rulers to themselves when strangers are near.', needs: [] },
    { id: 'W2', text: 'The question of who has the right to rule here is not one to put to a local.', needs: [] },
  ]),
  'wound.demographic_pressure': frozen([
    { id: 'W0', text: 'The newcomers, and the work and housing they compete for, are not discussed in front of them.', needs: [] },
    { id: 'W1', text: 'Nobody here says aloud what they think of the newcomers and the work they take.', needs: [] },
  ]),
  'wound.trade_dispute': frozen([
    { id: 'W0', text: 'The quarrel over trade with the partner settlement is not discussed in front of its people.', needs: [] },
    { id: 'W1', text: 'Nobody here talks openly about the terms of trade with their partner, or whether they are fair.', needs: [] },
  ]),
  'wound.wild_magic': frozen([
    { id: 'W0', text: 'The wild magic, and what it has done to the people it touched, is not spoken of with strangers.', needs: [] },
    { id: 'W1', text: 'People here do not talk about the wild magic, and they do not like being asked.', needs: [] },
  ]),
});
