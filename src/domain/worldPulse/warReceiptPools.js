/**
 * domain/worldPulse/warReceiptPools.js — THE WAR / PEACE / HEGEMONY RECEIPT PROSE.
 *
 * A PURE DATA LEAF of the event-prose family (ruling R-BLD-4: the single-writer law reads
 * ONE WRITER FAMILY, never one file). eventProse.js remains the family HEAD — it owns the
 * deterministic pickers (`pickLine`, `warReceipt`, `peaceReceipt`, `hegemonyReceipt`), the
 * kind REGISTRIES that give each receipt its significance/audience/section/required slots,
 * and `EVENT_PROSE_REGISTRY`, the flat walker manifest every pool is auto-covered by. This
 * leaf holds ONLY the authored corpora those pickers draw from.
 *
 * WHY THE POOLS AND THE PICKERS ARE DIFFERENT MODULES. The corpora are the part that grows
 * without bound — every new war ruling, lineage kind and envoy receipt adds variants, and
 * the content programs author them in bulk against docs/content/RECEIPT_POOLS_WAR.md. The
 * pickers are a small, stable mechanism. Keeping them together meant every content batch
 * pushed a logic file further past its size ceiling; split, the corpus can grow on its own
 * budget and the mechanism stays reviewable.
 *
 * NOTHING HERE IS RE-SPELLED ELSEWHERE. These are re-exported from eventProse.js, so every
 * existing consumer and every kind-pool walker keeps importing them from exactly where it
 * did before — the split is invisible to the public surface.
 *
 * FIRST VARIANT IS CANONICAL. Each pool's first entry is the canonical line (marked
 * `// canonical`); the rest are seeded alternates chosen by `pickLine`'s FNV-1a fold, so the
 * same seed always yields the same sentence (THE PROMISE: a seed is a world, forever).
 *
 * PURE DATA: frozen literals and interpolation lambdas only — no Date, no Math.random, no
 * store, no I/O, no imports beyond the shared variant type.
 *
 * @enforced-by tests/domain/eventProse.test.js
 * @enforced-by tests/lint/envoyKindPools.walker.test.js
 * @enforced-by tests/lint/warRulingKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */


/** @type {Record<string, ProseVariant[] | Record<string, ProseVariant[]>>} */
export const WAR_RECEIPTS = Object.freeze({
  grievance: [
    'A ledger of grievances stands open: resentment runs hot, and old wrongs have not faded.', // canonical
    'The book of grievances stays open between them; anger endures and every old slight is remembered.',
    'Old accounts go unsettled, their bitterness kept alive by a long memory.',
    'Every slight is still tallied, every old wrong remembered, and nothing forgiven.',
  ],
  revanchism: [
    (x) => `Old wounds unforgotten: ${x.wounds} mark${x.s} in the ledger, and the grudge still burns.`, // canonical (keyword: unforgotten)
    (x) => `The old wounds are not forgotten: ${x.wounds} mark${x.s} stand in the ledger, and the grudge burns yet.`,
    (x) => `Wrongs long past still ache: ${x.wounds} mark${x.s} unavenged, and the grudge has not cooled.`,
    (x) => `The reckoning was never paid: ${x.wounds} old mark${x.s} in the ledger, and the anger keeps its heat.`,
  ],
  resource_pressure: [
    'Their granaries stand full while ours thin. Hunger is faster than patience.', // canonical
    'Their stores are heavy while our own run lean. An empty granary outpaces patience.',
    'They eat their fill while our larders empty. Want moves quicker than restraint.',
    'Their harvest keeps while ours fails. A hungry season answers sooner than diplomacy.',
  ],
  treaty_default: [
    'The treaty lies broken and the promised wagons never came. Oathbreach is casus.', // canonical (keyword: oathbreach)
    'The treaty is in tatters and the promised convoys never arrived. Oathbreach is cause enough.',
    'A signed compact went unhonoured and the pledged goods never came. Oathbreach makes the casus.',
    'The bargain was struck and then abandoned, the promised tribute withheld. Such oathbreach is its own casus.',
  ],
  encirclement: [
    'War stands at the borders on more sides than one. Better to strike than be ringed.', // canonical
    'Enemies press the frontier from several quarters. Better the first blow than the closing ring.',
    'Hostile banners gather on more marches than one. Strike now, or be surrounded at leisure.',
    'The borders are threatened from too many sides at once. Better to break out than be encircled.',
  ],
  foreign_clash: [
    'Our banners and theirs bleed for opposite claimants on the same field. The proxy is becoming our own quarrel.', // canonical
    'Our men and theirs die for rival claimants on one field. The proxy war is curdling into ours.',
    'We back opposite sides of the same contest with our own blood. What began as proxy is turning personal.',
    'Their sponsored side and ours meet on the same ground. The borrowed quarrel is becoming a private one.',
  ],
  legitimacy_hunger: [
    'The seat is contested at home. A foreign enemy is cheaper than a domestic answer.', // canonical
    'The throne is shaky at home. A war abroad costs less than an answer to the streets.',
    'Authority is questioned within the walls. An outside foe is a cheaper reply than reform.',
    'The seat is unsteady and challenged. A foreign quarrel buys the loyalty a domestic fix would not.',
  ],
  corruption_exposed: [
    'Their court is rotten and the rot is now public. Someone must answer for it.', // canonical
    'Their court is corrupt and the corruption is now in the open. A reckoning is demanded.',
    'The rot in their halls is known to all now. Such exposure calls for an answer.',
    'Their governance is fouled and the foulness laid bare. Someone must be made to answer.',
  ],
  ingratitude_debt: [
    'The grain we gave in the lean years is spoken of now as a debt unpaid. Ingratitude is its own casus.', // canonical
    'The aid we gave in the hungry years is now called a debt owed. Such ingratitude is casus enough.',
    'What we shared in the lean seasons is remembered as a loan unrepaid. The ingratitude alone is cause.',
    'The help extended in the thin years is recast as an obligation defaulted. Ingratitude makes its own casus.',
  ],
  dependency_by_design: [
    'Our looms and larders were bound to their markets by design. The dependence was built to be a leash.', // canonical
    'Our trades and stores were tied to their markets on purpose. The dependence was made to be a tether.',
    'Our workshops and granaries were fastened to their custom deliberately. The reliance was shaped into a leash.',
    'Our craft and provisions were made to lean on their markets by intent. The dependence was meant to bind.',
  ],
  // OPPORTUNISM (the vulture war, §14.1). The clause naming WHAT the court believes and
  // whether it is wrong is appended by opportunism.js — these lines carry the appetite,
  // the perceived-vulnerability clause carries the epistemics.
  opportunism: [
    'They are weaker now than they will ever be again. A season like this does not come twice.', // canonical (keyword: weaker)
    'They will never be weaker than they are this season. Such an hour does not return.',
    'Their guard is down and their house divided; they are weaker now than they will be again. The moment is the argument.',
    'Weaker than they have been in a generation, and mending. Wait, and the chance is gone.',
  ],
  // SACRED CLAIM (§14.1 ideology/faith), split by the CLOSED quadrant vocabulary: a
  // schism is a quarrel inside one rite, a natural enemy a quarrel between two.
  sacred_claim: {
    schism_axis: [
      'They keep our god and read it backwards. A heresy at our own altars is worse than a stranger god.', // canonical (keyword: heresy)
      'They name our god and invert its every teaching. Heresy among our own is fouler than any stranger creed.',
      'Ours is the god they claim, and they have turned it inside out. A heresy at home outweighs a foreign altar.',
      'They pray to our god in a corrupted tongue. Heresy under our own roof is the graver wrong.',
    ],
    natural_enemy: [
      'Their altars serve what ours abhor. There is no treaty to be made between such rites.', // canonical (keyword: altars)
      'What their altars honour, ours abhor. No treaty holds between rites so opposed.',
      'Their rite venerates everything our altars condemn. Between such faiths there is nothing to sign.',
      'Their altars and ours want opposite things of the world. No compact survives that.',
    ],
  },
  // WR-2 DISPOSITION. These eight pools are copied from the governed war receipt
  // annex. Each member is a different structural family; interpolated slot values do
  // not increase the family count. The dedicated selector below persists that family.
  disposition_martial_crossed: [
    (x) => `${x.settlement}'s martial temper now leans ${x.lean}; resolved contests changed the lesson.`,
    (x) => `The muster carries ${x.weight} weight in council than it did a generation ago.`,
    (x) => `${x.settlement}'s watchfires now draw a ${x.answer} answer from the court.`,
    (x) => `The court is ${x.answer} when captains ask for another campaign.`,
    (x) => `What force accomplished has made ${x.settlement} lean ${x.lean} on the next quarrel.`,
  ],
  disposition_mercantile_crossed: [
    (x) => `${x.settlement}'s mercantile temper now leans ${x.lean}; resolved ventures changed the lesson.`,
    (x) => `The quays carry ${x.weight} weight in council than they did before.`,
    (x) => `A generation of ledgers has made the court ${x.answer} about another bargain.`,
    (x) => `The town gives a ${x.answer} answer when its factors propose a costly venture.`,
    (x) => `What commerce accomplished has made ${x.settlement} lean ${x.lean} on the next bargain.`,
  ],
  disposition_diplomatic_crossed: [
    (x) => `${x.settlement}'s diplomatic temper now leans ${x.lean}; kept and broken pacts changed the lesson.`,
    (x) => `The treaty table carries ${x.weight} weight in council than it did before.`,
    (x) => `A generation of agreements has made the court ${x.answer} about another parley.`,
    (x) => `The town gives a ${x.answer} answer when a legate asks for a hearing.`,
    (x) => `What diplomacy accomplished has made ${x.settlement} lean ${x.lean} on the next quarrel.`,
  ],
  disposition_insular_crossed: [
    (x) => `${x.settlement}'s inward temper now leans ${x.lean}; its outward history changed the lesson.`,
    (x) => `The factors of ${x.house} are received ${x.welcome} than they were before.`,
    (x) => `The roads beyond the walls carry ${x.weight} weight in council than they once did.`,
    (x) => `The town gives a ${x.answer} answer when outsiders ask it to look beyond itself.`,
    (x) => `What outside ties accomplished has made ${x.settlement} lean ${x.lean}.`,
  ],
  disposition_reversal: [
    (x) => `${x.settlement}'s ${x.aspect} temper crossed its old balance and now leans ${x.lean}.`,
    (x) => `Later outcomes reversed what this court expected from ${x.practice}.`,
    (x) => `A learned habit is not a ratchet: ${x.settlement} now leans ${x.lean} on ${x.practice}.`,
    (x) => `The council changed its mind about ${x.practice}, slowly and on the evidence.`,
    (x) => `The old lesson no longer holds; ${x.practice} now draws a ${x.answer} answer.`,
  ],
  deity_war_pressure: [
    (x) => `${x.settlement}'s rites of ${x.domain} make a quicker muster easier to defend in council.`,
    'The local rites make a quicker muster easier to defend in council.',
    'Voices of restraint find less purchase in the court shaped by this worship.',
    'The rites do not order wars; they make restraint harder to argue.',
    'Local worship has lowered the court’s bar for arms.',
  ],
  deity_peace_pressure: [
    (x) => `${x.settlement}'s harvest rites leave its court ${x.band} slower to muster.`,
    'The local rites make another season easier to defend than another campaign.',
    (x) => `The court sets the cost of war beside its trade in ${x.good}, a reckoning no captain likes to hear.`,
    'Local worship has never forbidden war; it has made war look expensive.',
    'Where harvest rites shape the court, a grievance is more likely to wait another season.',
  ],
  war_culture_suppressed: [
    (x) => `${x.settlement}'s peaceable house, harvest rites, and book of losses cannot support a warlike reading; the contradiction is written plainly.`,
    (x) => `The clerks went looking for a martial temper at ${x.settlement} and wrote down what they found instead, item by item.`,
    'A town that has lost its wars and prays for rain is not made warlike by being asked.',
    'The court could be pressed and would not move; the ledger explains why before anyone asks.',
    'The contradiction is visible rather than silent: the warlike reading yields nothing, and every record behind that judgment is on the sheet.',
  ],
  // WR-3 LINEAGE CLAIM. The five governed kinds are copied from the receipt
  // annex. A parent/child name is interpolated only where the selected family
  // actually asks for it; lineageReceipt skips a family rather than inventing a
  // missing house, settlement, counterpart, or authored inversion band.
  lineage_edge_recorded: [
    (x) => `The steading at ${x.settlement} stands on its own books now, and remembers whose granary fed it.`,
    (x) => `${x.counterpart} seeded it, provisioned it, and has been outgrown by it.`,
    'What was a satellite is a settlement; the parish register says so, which is what matters later.',
    'The daughter house keeps its own reeve and its own quarrel with the tolls.',
    'A lineage edge is a small entry in a book and the cause of a great deal.',
  ],
  casus_lineage_claim_parent: [
    (x) => `${x.settlement} claims ${x.counterpart} by right of founding: it seeded the place, and the place has fallen ${x.band} below the seeding.`,
    'The parent house says the daughter cannot hold what it was given, and offers to hold it instead.',
    (x) => `There is a founding charter in the chest at ${x.settlement} and a hungry season at ${x.counterpart}; the two arguments arrived together.`,
    'They call it reclamation and their neighbours call it what it is.',
    "A thriving parent has no quarrel with a modest steading — which is why this parent's books are worth reading.",
  ],
  casus_lineage_claim_child: [
    (x) => `${x.settlement} was founded out of ${x.counterpart} and has outgrown it; the seat, it says, should follow the granary.`,
    'The daughter house keeps the bigger market and asks why it keeps the smaller title.',
    (x) => `The factors of ${x.house}, who once shipped through the parent's wharf, own it in all but the charter.`,
    'The child claims the seat by the simplest argument there is: it feeds more people.',
    'What was gratitude for a generation has become a grievance in a single harvest.',
  ],
  mirror_kinship_bond: [
    (x) => `The same founding that arms a claim binds a peace: ${x.settlement} and ${x.counterpart} read one edge and chose the other sign.`,
    'They share a charter and a graveyard; the courts remembered the graveyard.',
    'Kin do not sack kin cheaply, and both books said so.',
    'The lineage was cited by both sides to opposite ends, and the quieter reading held.',
    (x) => `The bond cost ${x.settlement} the claim, and the council called it a bargain.`,
  ],
  lineage_claim_suppressed: [
    'You do not sack the satellite you spent a generation provisioning; the claim scores nothing and the chronicle is named against it.',
    'The relationship record contradicts the casus, and the receipt says which entries do it.',
    'The court could raise the claim; its own wagon books refuse it.',
    'Sustained provisioning stands in the ledger where the grievance would go.',
    'Nothing was minted, so nothing decays; this claim waits on a change in the wagon books, not a change of heart.',
  ],
  // WR-4 COMPARATIVE COSTS + THE HOME FRONT. These nine governed kinds are
  // copied verbatim from the receipt annex. warCostReceipt resolves only
  // families whose named truths are present; it never invents a route, good,
  // house, NPC, temple, settlement, counterpart, or authored world-word band.
  war_trajectory_winning: [
    (x) => `The court of ${x.settlement} believes the war is turning its way, and prices every offer accordingly.`,
    'The word from the field is good, and the word is all the hall has.',
    'Terms that would have been signed in the spring are refused by the harvest, on no better evidence.',
    'Believing you are winning is expensive; the court has begun to pay for it.',
    (x) => `It is said the enemy is spent ${x.band}. The couriers who say so have been a fortnight on the road.`,
  ],
  war_trajectory_losing: [
    (x) => `${x.settlement}'s court believes the war is going against it, and the belief moves faster than the news.`,
    'The hall has begun to ask what peace costs, which is the first honest question of the war.',
    'Every report is read for the worst line in it.',
    (x) => `They may be wrong. They are certainly frightened, and the ${x.term} they draft will show it.`,
    'A court that believes it is losing will sign what a court that is losing would not.',
  ],
  home_front_roads: [
    (x) => `${x.route} has gone to ruts while the levies were away, and the tolls have gone with it.`,
    'Nobody has cut the causeway brush in a season; the drovers take the long way and charge for it.',
    'While the war continues, the road-work goes undone.',
    'The bridge at the ford held through the war and has not held since.',
    (x) => `One of ${x.settlement}'s wartime roads has worsened; the loss is ${x.band} harder to ignore.`,
  ],
  home_front_stores: [
    (x) => `The granaries of ${x.settlement} hold ${x.band}, and there is another season of war in front of them.`,
    (x) => `The reeve has begun measuring the seed ${x.good}, which is the last measure before hunger.`,
    'The war eats first and the town eats after; that order is written in the stores.',
    'The campaign continues while the stores remain low.',
    'There is bread enough for the season, and the season is not the question.',
  ],
  home_front_hands: [
    (x) => `${x.settlement} has sent ${x.band} of its hands to the field, and the work at home has noticed.`,
    'The harvest was got in by the old and the young, and got in late.',
    'The muster took the smiths first, which the town will feel for a generation.',
    (x) => `Names that ran the market are on the roll instead of the ledger, ${x.npc} among them.`,
    'A town can survive a war; it cannot keep sending its working hands away without paying for it at home.',
  ],
  home_front_institutions: [
    (x) => `The assize at ${x.settlement} sits with a clerk and no justice; the court has been hollowed by the war's bill.`,
    (x) => `The ${x.temple} keeps its doors and has stopped keeping its school.`,
    'Institutions need not fall to thin, and thin, and one day fail at the thing they are for.',
    'What was a working court is a room with a register in it.',
    'The buildings remain. Their offices cannot do the work they were built to do.',
  ],
  home_front_markets: [
    (x) => `The factors of ${x.house} no longer come to ${x.settlement}'s staple, and the wharf shows it.`,
    'The wharf hands stand about by the middle of the morning, and have done so since the levies went out.',
    (x) => `${x.good} that moved through this town moves around it now.`,
    'A recorded market tie has closed while the war continues.',
    'The tolls are what they were and there is nothing to toll.',
  ],
  winning_abroad_losing_at_home: [
    (x) => `${x.settlement}'s banners stand on ${x.counterpart}'s walls and its own granaries hold ${x.band}.`,
    'The couriers bring victories and the reeve brings the accounts; only one of them is believed in the market.',
    'The victory dispatch is read out in the market square, where the price of bread answers it.',
    'Every field taken has been paid for with a road, a craftsman, and a market.',
    'The gains abroad are real. So is the strain at home, and home is nearer.',
  ],
  trajectory_misread: [
    'The court believed the war was turning; the field says otherwise, and the receipt carries both readings.',
    (x) => `What ${x.settlement}'s hall knows and what is true have parted company, and the distance is on the record.`,
    'The belief is honest and wrong, which is the most expensive combination there is.',
    'The terms about to be drafted rest on a report the world has already overtaken.',
    'Nobody in that hall is wrong on purpose, which will be no comfort to anyone afterward.',
  ],
  // WR-5 THE TWO BOOKS + THE POLITICAL LOOP. These fourteen kinds are copied
  // from the war receipt annex. The section-eight parentheticals in the source
  // volume are editorial cross-references, not reader prose, so they are not
  // persisted with the first sentence of either suing pool.
  sued_for_peace_seat: [
    (x) => `${x.npc} sued for peace.`,
    "The offer went out over the seat's name and not the town's, and the quays noticed the distinction.",
    'It was the seat that could not carry another season, whatever the granaries said.',
    (x) => `${x.npc} sued, and the council was told afterward.`,
    'The peace served the man before it served the walls, and the receipt names whose books it answered.',
  ],
  sued_for_peace_realm: [
    'The realm sued for peace.',
    (x) => `The council of ${x.settlement} voted the offer and ${x.npc} carried it, willing or not.`,
    'The granaries wrote the terms; the seat only signed them.',
    'It was the town that wanted it ended and the town that will pay for the ending.',
    "The offer went out over the settlement's name, which tells you which book was open.",
  ],
  war_continued_for_the_seat: [
    (x) => `The war ruins ${x.settlement} and secures ${x.npc}, and it continues.`,
    "The council's arithmetic and the seat's arithmetic parted in the spring; the seat's won.",
    'Peace would cost the hall more than the war costs the town.',
    (x) => `Every season of this war is a season ${x.faction} cannot move.`,
    "The receipt names whose books were served, and they were not the town's.",
  ],
  war_ended_against_rival_triumph: [
    (x) => `${x.settlement} ended a war it was winning, because winning it would have crowned ${x.npc}.`,
    "The victory was already spoken for, and the seat declined to pay for another man's triumph.",
    'Terms were taken that the field did not require.',
    'A general too successful is a problem no treaty solves, so the treaty solved the war instead.',
    'They stopped short, and the reason is in the hall rather than the field.',
  ],
  peace_refused: [
    (x) => `${x.counterpart} offered terms and ${x.settlement} refused them; the refusal stands on the record with ${x.reason} and a name beside it.`,
    (x) => `The legate was heard, thanked, and sent back down ${x.route} with nothing.`,
    'The offer was read aloud in council, which is how the town learned there had been one.',
    'A refusal is a fact like a battle and goes into the same book.',
    (x) => `${x.npc} said no, and the saying of it hardened everything after.`,
  ],
  refusal_cost_legitimacy: [
    (x) => `${x.settlement} refused peace, and the streets priced the refusal within the season.`,
    'The seat spent its standing to keep its war.',
    'Men who bore the levy quietly do not bear a refused peace quietly.',
    (x) => `The council's confidence in ${x.npc} reads ${x.band}, and the refusal is the reason on every tongue.`,
    'Nothing was lost in the field that day. A good deal was lost in the market square.',
  ],
  refusal_cost_ally_patience: [
    (x) => `${x.counterpart} was refused, and ${x.third_party} read the refusal as a bill it had not agreed to.`,
    "The ally's factors have begun asking how long, which is the question before the door.",
    (x) => `Patience is a stock like any other, and this drew ${x.band} on it.`,
    "They refused peace with somebody else's soldiers in the field.",
    'The alliance held. It is thinner than it was, and both courts know it.',
  ],
  ruler_books_compromised: [
    (x) => `${x.npc} optimises a third book: the terms answer ${x.faction}'s needs before ${x.settlement}'s.`,
    'Every concession refused is a concession the patron would have paid for.',
    "The seat's arithmetic is sound; it is being done for somebody else.",
    'The web already knows whose interest this is, and the receipt names it.',
    'The war serves a party that has not sent a single man to it.',
  ],
  war_party_overturns_peacemaker: [
    (x) => `The peace ${x.npc} signed cost the seat: the war party took the hall and named the treaty as their grievance.`,
    (x) => `${x.faction} organised around one decision and rode it into the council chamber.`,
    'Men who were nobody in the spring hold the gate keys by the harvest.',
    'The town did not overturn a ruler; it overturned a signature.',
    'A peace made against the powers is a coup with a delay on it.',
  ],
  peace_party_overturns_warmonger: [
    (x) => `${x.settlement} put down the seat that kept the war, and the granaries did the counting.`,
    (x) => `${x.faction} formed at the almsgate and finished in the hall.`,
    'The war was the whole of the grievance and the whole of the programme.',
    'They removed the man and kept the levies, which is how these things usually end.',
    'The successor inherits a peace he must now actually make.',
  ],
  succession_demand_inherited: [
    (x) => `${x.faction} seated ${x.npc} on one condition, and the condition rides the succession record.`,
    'The new seat is not free: it was seated to do a particular thing about the war.',
    'A coup that does not bind its successor was a coup for nothing.',
    'The demand is written where the succession is written, and the next re-read must answer it.',
    'He holds the hall, and the hall holds a receipt.',
  ],
  successor_repudiates_war: [
    (x) => `${x.npc} came to the seat, read the war again, and the levies are coming home.`,
    'The quarrel belonged to a man who no longer holds the chair.',
    'The new seat owes the dead nothing and says so, which is easier from that chair than from any other.',
    'Momentum breaks at a succession, and this one broke loudly.',
    'Nothing changed in the field. Everything changed in the hall.',
  ],
  successor_escalates_war: [
    (x) => `${x.npc} came to the seat and widened the war his predecessor could not end.`,
    'The same state, the same ledgers, a different character — and a new front.',
    'The successor opened with a muster, and the town read it correctly.',
    'The restraint was never in the ledgers; it sat in a chair, and it sits there no longer.',
    'He inherited a stalemate and called it an opportunity.',
  ],
  war_dissolved_by_verdict: [
    (x) => `The officeholder whose rot opened the war was removed; ${x.npc} holds no quarrel with ${x.counterpart}, and the war has nothing left to stand on.`,
    'The casus was a man, and the man is out of office.',
    'The court that raised the grievance cannot now find anyone in it who owns the grievance.',
    'A verdict in one hall closed a war in another.',
    'They went to war over a corruption and unmade the war by exposing it, which the chronicles will call luck.',
  ],
  // WR-6 THE COALITION GRAPH. These twelve kinds are copied from the war
  // receipt annex. `warCoalitionReceipt` admits only families whose named
  // facts are present, so an unknown road, good, settlement, ally, enemy, or
  // qualitative band can never be improvised onto a reader card.
  coalition_entry_priced: [
    (x) => `${x.settlement} counted who might answer for ${x.counterpart}, and then who might answer for those.`,
    'The court priced the far compacts as beliefs, not promises of who would arrive.',
    'The obligation is plain and the arithmetic behind it is not.',
    (x) => `Entering a war is cheap; entering the war behind it is not, and this one prices ${x.band}.`,
    'They read the whole web before they read the field, which is why they are still deciding.',
  ],
  coalition_joined: [
    (x) => `${x.settlement} answered the call and opened its own edge against ${x.third_party}; the casus on the record is the obligation itself.`,
    (x) => `The banners went out down ${x.route}; the joined court now owns a separate front.`,
    'They came because they had said they would, and because the reading of not coming was worse.',
    "An ally's war is a war, with its own ledger and its own ending.",
    (x) => `${x.settlement}'s own war edge now records the alliance call among its causes.`,
  ],
  coalition_refused: [
    'They were called, and would not come.',
    (x) => `${x.settlement} read the alliance web, read its own books, and sent regrets down ${x.route}.`,
    (x) => `The refusal is a fact in the record now; how ${x.counterpart} reads it is ${x.counterpart}'s character.`,
    'The obligation was real and the answer was no, and both will be remembered.',
    'The refusal is archived on the allied edge as a durable fact.',
  ],
  casus_alliance_obligation: [
    (x) => `${x.settlement} is in this war because ${x.counterpart} called and the compact answers for it.`,
    'The alliance obligation is one recorded cause on this edge; other live causes remain their own facts.',
    "The borrowed cause remains anchored to the caller's exact war episode and compact.",
    'They march for a paper, which is a better reason than most.',
    (x) => `This edge against ${x.third_party} exists because an older edge does.`,
  ],
  mirror_obligation_discharged: [
    (x) => `The obligation is discharged: ${x.settlement} came when called.`,
    'The record now carries service under the compact beside the obligation it answered.',
    'They answered the alliance in the field, and that answer is recorded.',
    'What was owed under this call was given; other claims remain separate.',
    'The compact survived this use, and the relationship record says so.',
  ],
  coalition_expenditure_read: [
    (x) => `${x.settlement}'s surviving current-episode evidence reads ${x.band}; no lifetime total is invented.`,
    'The read uses deployed strength, recorded attrition, live exposure, and attributable home-front evidence.',
    'Damage that healed or left the bounded record is silence in this reckoning.',
    'What the alliance cost was never written down as a total — it is what the other books already say.',
    'The reckoning exists whether or not the coalition wants to hold it.',
  ],
  coalition_stayed: [
    'They stayed.',
    (x) => `${x.settlement} reread its open edge against ${x.third_party} and kept its army in the field.`,
    'The council reread the war, weighed the same ledgers as its neighbours, and reached the opposite conclusion.',
    'Staying was a decision and not an inertia, and the record says who made it.',
    'The ally that stays is owed differently from the ally that came.',
  ],
  coalition_separate_peace: [
    'They went home.',
    (x) => `${x.settlement} settled its own edge with ${x.third_party} and left the rest of the war standing.`,
    'The peace was pairwise, as every peace in this world is; the others learned of it from travellers.',
    'What the abandoned call betrayal, the departed call arithmetic, and the record carries both.',
    'One edge closed; every other front kept its own state and ending.',
  ],
  coalition_apportionment: [
    (x) => `The losers were assessed together and pay separately: ${x.band} in ${x.good} falls on ${x.settlement} by capacity, culpability, and who called whom.`,
    'One aggregate judgment became separate bilateral shares under the same settlement identifier.',
    'Capacity, culpability, field loss, and the alliance call all bear on the share; none alone dictates it.',
    'Collective liability, pairwise payment — the wagons roll along the edges they always rolled along.',
    'The apportionment is archived as a durable relationship fact.',
  ],
  coalition_spoils_divided: [
    'The victors divided the settlement by who bled, who led, and who came late.',
    (x) => `${x.settlement} received ${x.band} of the ${x.good} under the coalition settlement.`,
    'What was won together was assigned along ordinary bilateral transfer edges.',
    'What was won together is held separately, with every share archived on the relationship record.',
    "Every share is an explicit judgment on contribution under the same settlement identifier.",
  ],
  coalition_debt_paid: [
    'They paid what they owed.',
    (x) => `${x.counterpart} settled the recorded coalition claim owed to ${x.settlement}.`,
    'The conserved transfer met the recorded claim, and no unpaid remainder was minted.',
    (x) => `The payment travelled along ${x.route} and is archived as payment, never forgiveness.`,
    'This coalition claim is closed; other causes and obligations remain separate.',
  ],
  coalition_debt_unpaid: [
    'They never paid.',
    (x) => `${x.settlement}'s recorded claim against ${x.counterpart} remains unpaid along ${x.route}.`,
    (x) => `The missing ${x.good} remains an ordinary live obligation between the allied courts.`,
    'The coalition settlement closed without settling this internal claim.',
    'The unpaid obligation may later be read as ingratitude; it is not yet a new war.',
  ],
  // WR-7a THE ERRAND. These seven pools are the first physical peace-message
  // states. `envoyReceipt` admits a family only when every identity/place it
  // names is supplied by typed evidence; silence uses authored slotless siblings
  // rather than an engine id, route token, or timing scalar.
  envoy_departed: [
    (x) => `${x.npc} left ${x.settlement} for ${x.counterpart}'s court by ${x.route}, carrying the seat's authority and nothing faster than a horse.`,
    'The legate went out at first light with a sealed sheet and a picture of the world already going stale.',
    'The town watched a man leave and understood that the war now moves at his pace.',
    'He carries what the court believes, which is not the same as what is.',
    'An errand is a week to a leg, and there are several legs.',
    'By the time the seal leaves sight of the gate, the facts beneath it have begun to age.',
  ],
  envoy_on_the_road: [
    (x) => `${x.npc} lies at ${x.route} this week; a road is a place, and he is in it.`,
    'The legate is somewhere between the courts, which is the only honest thing anyone can say.',
    'Nothing has changed at either hall, and something has changed everywhere he has passed.',
    'News overtakes a man on a road. It always has.',
    'He will arrive with the world he left and find another.',
    'The horse must rest. The fighting need not.',
    'Each mile carries the messenger farther from the council that chose the words.',
    'A sealed message can be in motion while every power it names remains where it was.',
    'Those who hear of the journey may know more of it than either waiting court.',
    'The messenger has no new vote to cast between one mile and the next.',
    'A public road gives a sealed purpose no promise of privacy.',
    'The message moves; its authority waits.',
  ],
  envoy_intercepted: [
    (x) => `${x.npc} was taken on ${x.route} by ${x.third_party}, and the court he was riding to does not know it.`,
    'A column with its own reasons found the legate before the destination did.',
    'The sheet he carried is read now by somebody who was never meant to read it.',
    'Interception is not capture; it is a change of counterparty.',
    'The errand did not fail. It arrived somewhere else.',
  ],
  envoy_parlaying: [
    (x) => `${x.npc} sits at parley with ${x.counterpart}, and each side is arguing from a different world.`,
    'The terms are being drafted from pictures that stopped matching a fortnight ago.',
    "Two courts' beliefs have met in one room, and neither of them is the truth.",
    'The talking has begun, which is not the same as the stopping.',
    'Whatever is agreed here binds nothing until it is carried home and told.',
    'They spent a fortnight on the seating and a morning on the terms, which is the ordinary proportion.',
  ],
  envoy_terms_agreed: [
    (x) => `A ${x.term} was struck at ${x.counterpart} and is a sheet of paper on a road.`,
    (x) => `${x.npc} has an agreement and a fortnight of riding between it and any authority.`,
    'The war continues while the peace travels, and both are true at once.',
    'What was agreed was agreed on beliefs, and the beliefs will be tested on the way home.',
    'A signature at a parley is a promise about a world neither party can see.',
  ],
  envoy_returning: [
    (x) => `${x.npc} rides for ${x.settlement} with the terms and is a richer target than he was going out.`,
    'The return leg is the dangerous one, and every party that wanted the war continued knows it.',
    'He carries the peace at the speed of a horse and the war at the speed of couriers.',
    'The court that sent him is waiting on a road, which is a poor thing to wait on.',
    'Nothing is settled until he tells it.',
    'Every mile home carries an agreement closer to authority and leaves it exposed a little longer.',
  ],
  envoy_home: [
    (x) => `${x.npc} came home to ${x.settlement} and told the terms, and only then did they mean anything.`,
    "The sheet was read aloud in council, and the council heard one man's account of another court.",
    'He arrived, and the world he described had moved on without either of them.',
    'The errand is closed and the argument is beginning.',
    'The peace exists now, and it exists because a man got back.',
  ],
  envoy_held: [
    (x) => `${x.npc} is held at ${x.counterpart} on ${x.reason}, a guest in every sense but the one that matters.`,
    "He is neither jailed nor free; the captor's record calls it a hold, and so does everyone else.",
    'The court that sent him has had no word and is drawing conclusions.',
    'A held envoy is a term sheet nobody has read and a demand nobody has made yet.',
    'The hold began on a particular day and is being counted, which is how ransoms start.',
  ],
  envoy_lost: [
    (x) => `The errand closed without word: ${x.npc} did not reach ${x.counterpart} and has not come home.`,
    'Nothing is known beyond the silence, and the record says exactly that.',
    (x) => `${x.route} took him, in whatever sense roads take people; the receipt does not pretend to know.`,
    'What the court does next rests on an absence.',
    'A man is missing, and a peace is missing with him.',
  ],
  envoy_silence_inference: [
    (x) => `No word has come from ${x.route}; the court fears the worst.`,
    (x) => `The window for his return closed a fortnight ago, and the hall has begun to speak of ${x.npc} in the past tense.`,
    'Silence is being read as an answer, and it may not be one.',
    (x) => `${x.settlement} believes ${x.counterpart} has taken its legate. It believes this because nothing has arrived.`,
    'The court is hardening around an absence, which is the cheapest thing in the world to be wrong about.',
  ],
  terms_never_reached: [
    'The terms were agreed and the envoy never reached them.',
    (x) => `Peace was made on ${x.route} and died there.`,
    'Two courts have agreed and neither of them knows it.',
    'The sheet exists. The war exists. Nothing has connected them.',
    'What was signed at the parley is the property of the road now.',
  ],
  terms_signed_for_a_fallen_town: [
    'The terms were signed for a town that had already fallen.',
    (x) => `${x.settlement} conceded ${x.route}, which was cut before the ink was mixed.`,
    'The document is perfectly valid and describes nowhere.',
    'Both parties bargained hard over a thing that no longer existed.',
    'The mismatch will be discovered in the ordinary way and become the next grievance.',
  ],
  parlay_at_an_occupied_venue: [
    (x) => `They parleyed at ${x.settlement} — a town ${x.counterpart} holds, which nobody thought worth mentioning.`,
    "The terms of the war were drafted in a hall under the enemy's garrison, and the wine was good.",
    "A legal venue is a legal venue; the irony is not the clerks' business.",
    'The seat that owns the town was not in the room.',
    'Peace was discussed where the war had already been decided.',
    'The town served both delegations and was counted as a party to neither.',
  ],
  interceptor_dilemma: [
    (x) => `${x.third_party} holds terms it could carry home, and carrying them means leaving the field.`,
    "The column's court must choose between a paper and a position, and its books disagree.",
    'Carrying the sheet is a real military cost, and the court will not see it that way.',
    'The column can hold the field or carry home terms, and not both this season.',
    (x) => `The mission was to hold ${x.route}. The opportunity is on the table.`,
    'There is no standing order for this, which is why it will be judged so confidently afterward.',
  ],
  interceptor_parlays_own_edge: [
    (x) => `${x.settlement} opened a parley on its own edge with ${x.counterpart}; the rest of the war remained standing.`,
    'An ally looked for its own reason to keep fighting and found none.',
    'A new peace errand left through the coalition edge nobody was watching.',
    'The borrowed quarrel no longer answered for a fresh season in the field.',
    'One court sent its own legate because an alliance can open a war without deciding how long it lasts.',
  ],
  parlay_terms_neither_court_drafted: [
    (x) => `The field parley produced a ${x.term} neither hall would have written, because neither hall was in the field.`,
    'Two stale pictures met and agreed on a third world.',
    'The parties in the field drafted from what they had seen; the courts will read it from what they were told.',
    'Both seats will call the sheet strange, and both will be right.',
    'What is fair depends entirely on where you were standing when you last had news.',
  ],
  // fear_of_dominance — authored in hegemonyFear.js (see HEGEMONY_RECEIPTS below).
});

/** @type {Record<string, ProseVariant[] | Record<string, ProseVariant[]>>} */
export const PEACE_RECEIPTS = Object.freeze({
  exhaustion: [
    'War exhaustion has worn the town to the bone; the seat needs peace to survive.', // canonical (keyword: exhaustion)
    'The war has ground the town to the bone; the seat must have peace to last.',
    'The fighting has hollowed the town; without peace the seat cannot hold.',
    'The war has spent the town to its bones; peace is now a matter of survival.',
  ],
  belief_convergence: {
    converged: [
      'The fighting has taught both courts the same truth. No offer insults any longer.', // canonical (keyword: same truth)
      'The war has taught both courts the same truth at last. No terms give offence now.',
      'Both courts have been schooled to the same truth by the fighting. No offer is an insult any more.',
      'The fighting has brought both courts to the same truth. An honest offer no longer offends.',
    ],
    drifting: [
      "The courts' reckonings drift closer. The war is running out of illusions.", // canonical
      "The two courts' accounts draw nearer. The war is losing its illusions.",
      'Their reckonings are converging. The war has fewer illusions left to spend.',
      'The courts read the war more alike now. The last illusions are wearing thin.',
    ],
  },
  economic_strangulation: {
    base: [
      'The routes are severed and the treasury bleeds. The war costs more than its aims.', // canonical
      'The trade routes are cut and the treasury drains. The war now costs more than it can win.',
      'With the routes broken and the coffers emptying, the war is dearer than its purpose.',
      'The severed routes and the bleeding treasury make the war cost more than it could ever gain.',
    ],
    blockade: [
      'The harbour is blockaded. No keel comes or goes, and the wharves stand idle; a strangled port cannot bear the war.', // canonical (keyword: blockaded)
      'The port is blockaded. Nothing sails in or out, and the docks lie still; a choked harbour cannot fund a war.',
      'A blockade seals the harbour. No ship moves, and the quays stand empty; a strangled port cannot sustain the fight.',
      'The harbour is blockaded shut. No cargo comes or goes, and the wharves are idle; a throttled port cannot carry the war.',
    ],
    supplyweb: [
      'A neighbour strangles the supply web by design. The granary villages burn and the routes are cut; the war cannot be borne.', // canonical (keyword: supply web)
      'A neighbour throttles the supply web on purpose. The granary villages fall and the routes are severed; the war cannot be carried.',
      'The supply web is being strangled by deliberate design. The feeder villages are put to ruin and the roads cut; the war is past bearing.',
      'A rival chokes the supply web by intent. The granary hamlets are wasted and the routes broken; the war can no longer be borne.',
    ],
  },
  coalition_fracture: [
    (x) => `The coalition thins: ${x.peel} of ${x.peak} co-belligerents have left the field.`, // canonical (keyword: coalition thins)
    (x) => `The coalition is thinning: ${x.peel} of ${x.peak} co-belligerents have quit the field.`,
    (x) => `The alliance frays: ${x.peel} of ${x.peak} co-belligerents have withdrawn from the field.`,
    (x) => `The war-coalition thins out: ${x.peel} of ${x.peak} co-belligerents have abandoned the field.`,
  ],
  // mediation — EVERY variant must lead with the mediator's name (the ^M pin).
  mediation: [
    (x) => `${x.mediatorName} stands torn between the belligerents. Its envoys carry terms both courts will hear.`, // canonical
    (x) => `${x.mediatorName}, caught between the belligerents, sends envoys with terms both courts will hear.`,
    (x) => `${x.mediatorName} is pulled both ways between the warring courts. Its envoys bring terms each will hear.`,
    (x) => `${x.mediatorName} stands cross-pressured between the two. Its envoys offer terms both courts can hear.`,
  ],
  harvest_pressure: [
    'The harvest stands in the fields and the levies mutter of home. Wars pause for bread.', // canonical
    'The harvest waits in the fields and the levies grumble for home. Wars give way to bread.',
    'The crop stands ready and the levies long for home. Even wars pause for the harvest.',
    'The fields are heavy with harvest and the levies want home. Bread stills the war for a season.',
  ],
  realignment: {
    common: [
      'A third banner is at both gates. The peace is signed in haste, for the horde was at the passes.', // canonical (keyword: horde/passes)
      'A common enemy stands at both gates. The peace is signed in haste, for the horde was in the passes.',
      'One third banner threatens them both. Terms are struck quickly, with the horde already at the passes.',
      'A shared foe presses both courts. The peace comes in haste, the horde loose in the passes.',
    ],
    distinct: [
      'Each court is beset by another foe. This front is a luxury neither can keep.', // canonical
      'Each court has another enemy of its own. This front is a luxury neither can afford.',
      'Both courts face separate threats elsewhere. Keeping this front is a luxury for neither.',
      'Each is pressed by a different foe. Neither can spare the strength this front demands.',
    ],
  },
  spheres_understanding: [
    'Better to draw a line between our claims than to make this proxy our own war: a sphere apiece, and the field left to them.', // canonical
    'Better a line drawn between our claims than a proxy made our own war: a sphere for each, the field left to them.',
    'Sooner a boundary between our claims than a borrowed quarrel turned real: a sphere apiece, and the field theirs.',
    'Rather mark our claims apart than let this proxy become our war: a sphere for each side, the field left to them.',
  ],
  debt_forgiven: [
    'The old grain-debt is spoken of as a gift once more. What was owed is forgiven, and the quarrel loses its cause.', // canonical
    'The old grain-debt is called a gift again. What was owed is written off, and the quarrel loses its reason.',
    'The aid once counted a debt is named a gift once more. The obligation is forgiven, and the cause of the quarrel falls away.',
    'The old debt of grain is remembered as a gift again. It is forgiven, and with it the quarrel loses its ground.',
  ],
  bonds_of_commerce: [
    'Too many looms and larders bind us to their markets. A war would cost more than either court could bear.', // canonical
    'Too many trades and stores tie us to their markets. A war would cost more than either court could stand.',
    'Our workshops and granaries are too bound to their custom. A war would cost more than either could bear.',
    'So much of our craft and provision leans on their markets. A war would ruin both courts before it settled anything.',
  ],
  // HOPELESSNESS (§14.2 no-other-options) — the MIRROR of opportunism: the same believed
  // balance, read from the losing end. The perceived clause is appended by opportunism.js.
  hopelessness: [
    'They can bear this longer than we can. Every month we fight, the gap widens against us.', // canonical (keyword: bear this longer)
    'They can carry this war longer than we can. Each month we hold out, the gap grows against us.',
    'Their strength outlasts ours by a wide margin. The longer this runs, the worse our position.',
    'We cannot outlast them, and every season proves it further. There is no victory down this road.',
  ],
  // COMMON RITE (§14.2 moral/faith) — the same quadrant as sacred_claim, read the other way.
  common_rite: {
    brothers: [
      'We keep the same god and read it the same way. There is a floor here both courts can stand on.', // canonical (keyword: same god)
      'The same god, and the same reading of it. Both courts have a floor to stand on here.',
      'One god between us, understood alike. That is common ground enough for terms.',
      'We share a god and an understanding of it. Two courts on one floor can be brought to terms.',
    ],
    respectable_rival: [
      'Their rite is not ours, but it asks the same things of a person. Two honest faiths can share a table.', // canonical (keyword: share a table)
      'Their rite differs from ours, yet asks the same of a person. Honest faiths can share a table.',
      'A different altar, the same virtues taught beneath it. Such courts can sit at one table.',
      'We do not share their god, but we recognise what it asks. That is enough to share a table.',
    ],
  },
  // balance_restored — authored in hegemonyFear.js (see HEGEMONY_RECEIPTS below).
});

/** @type {Record<string, ProseVariant[]>} the two hegemony-sphere receipts (hegemonyFear.js). */
export const HEGEMONY_RECEIPTS = Object.freeze({
  fear_of_dominance: [
    (x) => `The shadow of ${x.centerName} falls long over the free towns. Better to gather against it than be swallowed one by one.`, // canonical
    (x) => `${x.centerName}'s shadow lies long over the free towns. Better to band against it than be taken one by one.`,
    (x) => `The reach of ${x.centerName} looms over the free towns. Sooner a common stand than to be swallowed piecemeal.`,
    (x) => `${x.centerName} throws a long shadow across the free towns. Better to gather now than be devoured one at a time.`,
  ],
  balance_restored: [
    (x) => `${x.centerName}'s grip is slipping. With the shadow lifting, old rivals can breathe and treat.`, // canonical
    (x) => `${x.centerName}'s hold is loosening. As the shadow lifts, old rivals can breathe and come to terms.`,
    (x) => `The grip of ${x.centerName} is failing. With its shadow receding, old rivals find room to treat.`,
    (x) => `${x.centerName}'s dominance wanes. The shadow lifts, and old rivals can breathe and parley.`,
  ],
});

/** @type {readonly ProseVariant[]} decree-default war receipt (interp {type, to}). */
export const DECREE_DEFAULT_RECEIPTS = Object.freeze([
  (x) => `Declared by decree: ${x.type} against ${x.to}.`, // canonical
  (x) => `By decree, ${x.type} is declared against ${x.to}.`,
  (x) => `Set by decree: ${x.type} against ${x.to}.`,
  (x) => `A decree names the cause: ${x.type} against ${x.to}.`,
]);

/** Resolve a possibly-dotted pool key ("economic_strangulation.blockade") to its array.
 *  @param {Record<string, unknown>} root @param {string} typeKey @returns {readonly ProseVariant[]} */
