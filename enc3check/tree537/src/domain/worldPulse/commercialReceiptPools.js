/**
 * domain/worldPulse/commercialReceiptPools.js — THE TR-1 CASUS-COMMERCII RECEIPT PROSE.
 *
 * A PURE DATA LEAF of the event-prose family (ruling R-BLD-4: the single-writer law
 * reads ONE WRITER FAMILY, never one file), sibling to warReceiptPools.js and
 * sovereigntyReceiptPools.js. It holds ONLY the authored corpora the TR-1 pickers draw
 * from; commercialReasonsNews.js owns the registry rows, the picker and the reader
 * projection, and commercialReasons.js owns the ledger.
 *
 * ANNEX-VERBATIM, AND EXTRACTED RATHER THAN TRANSCRIBED. Every line below is
 * byte-identical to its authored variant in docs/content/RECEIPT_POOLS_TRADE.md under
 * `# TR-1 — THE CASUS COMMERCII`, with only the `{slot}` tokens turned into
 * interpolations and the annex's editorial exemplar markers stripped.
 * tests/lint/commercialKindPools.walker.test.js re-derives this file from the document
 * on every run through the ONE annex reader (tests/helpers/receiptAnnex.js), so a hand
 * edit here reds instead of silently forking the corpus away from the content program.
 *
 * THE FREQUENCY-SCALED FLOOR (SP-6a) is met by the annex as authored, measured by the
 * walker rather than asserted here: routine kinds carry nine or ten, notable six or
 * seven, major five.
 *
 * ⚠ THE FALLBACK CLAIM IS *PAIR-ONLY*, NOT *SLOTLESS* — and the difference was measured,
 * not assumed. The sovereignty pools each carry a wholly slotless variant; ELEVEN of the
 * twenty pools here do NOT, because a commercial receipt that named no town would not be
 * an address. What every pool does carry is at least one variant whose slots are a subset
 * of `{settlement}` and `{counterpart}` — the two names a DIRECTED PAIR always has — so
 * a receipt whose {good}, {route}, {band}, {house} or {reason} evidence is absent still
 * degrades to an honest authored sentence instead of a hole or a fabricated name. The
 * walker asserts that floor per pool; `commercial_cornering` sits AT it with exactly one,
 * which is why the floor is stated as a measurement rather than a comfortable margin.
 *
 * PURE DATA: frozen literals and interpolation lambdas only — no Date, no Math.random,
 * no store, no I/O, no imports beyond the shared variant type.
 *
 * @enforced-by tests/lint/commercialKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * The twenty TR-1 pools, keyed by engine kind token. The annex heading ids
 * (`cc.<type>`, `dossier.trade_relation_line`) are the CONTENT program's spelling;
 * the tokens here are the ENGINE's, and the walker pins the mapping in one authored
 * table so neither side can drift without reddening.
 * @type {Readonly<Record<string, readonly ProseVariant[]>>}
 */
export const COMMERCIAL_RECEIPTS = Object.freeze({
  // cc.contract_default — notable, public
  commercial_contract_default: [
    (x) => `${x.counterpart} took the wagons and sent nothing back; the compact is broken.`,
    (x) => `The wharf at ${x.settlement} waited for a cargo that never came, and stopped waiting in the autumn.`,
    (x) => `The factors' book at ${x.settlement} carries ${x.counterpart} in the column of debts unanswered.`,
    (x) => `What ${x.counterpart} owes in ${x.good} stands unpaid, and the next bargain will be dearer for it.`,
    (x) => `${x.counterpart} kept every clause but the one that cost it something.`,
    (x) => `Travellers out of ${x.counterpart} bring word of full warehouses there and cannot explain the empty road.`,
    'The carters sent to fetch it waited out the month at the far gate and came home with the load they left with.',
  ],
  // cc.contract_honored — routine, public
  commercial_contract_honored: [
    (x) => `${x.counterpart} sent the ${x.good} as agreed, and sent it on the season it was owed.`,
    (x) => `The quays of ${x.settlement} have learned to expect ${x.counterpart}'s wagons, and have not been disappointed.`,
    (x) => `Season upon season, the book at ${x.settlement} shows ${x.counterpart}'s side of the contract clean.`,
    (x) => `The compact with ${x.counterpart} holds, and the factors of ${x.settlement} borrow against it.`,
    (x) => `Nothing has happened between ${x.settlement} and ${x.counterpart} for years — which, in trade, is the whole of the good news.`,
    (x) => `Travellers out of ${x.counterpart} say the ${x.good} was loading before the season turned, and it was.`,
    (x) => `The ${x.settlement} gate looks for ${x.counterpart}'s wagons in the same week every year, and the year is reckoned from them.`,
    (x) => `A carter's boy at ${x.settlement} knows the ${x.counterpart} teams by their bells and runs to the gate before the clerks have heard anything.`,
    (x) => `At ${x.counterpart} the sending is entered as a small matter; at ${x.settlement} it is entered as the year's security.`,
  ],
  // cc.toll_extortion — notable, public
  commercial_toll_extortion: [
    (x) => `${x.counterpart} raised its toll on the ${x.route}, and every wagon out of ${x.settlement} pays for the road twice.`,
    (x) => `At the gate the carters count the levy and say the ${x.route} has a landlord now.`,
    (x) => `The toll stands in ${x.settlement}'s book as a wound that reopens at every crossing.`,
    (x) => `While ${x.counterpart} holds the ${x.route}, the ${x.good} of ${x.settlement} grows dearer with every league.`,
    (x) => `${x.counterpart} calls it the upkeep of the road; the carters call it something shorter.`,
    (x) => `Merchants coming the other way say the gate at ${x.counterpart} has grown a second table and a longer list.`,
    'The levy went up when the passes opened and has not come down since the snow returned.',
  ],
  // cc.toll_relief — routine, public
  commercial_toll_relief: [
    (x) => `${x.counterpart} lightened its toll on the ${x.route}, and the wagons out of ${x.settlement} came back heavier.`,
    'The carters noticed before the clerks did; the gate takes less than it did.',
    (x) => `The ${x.route} costs ${x.settlement} less this season than last, and ${x.counterpart}'s name is on the reason.`,
    (x) => `With the levy eased, the ${x.good} of ${x.settlement} reaches further than it has in years.`,
    (x) => `${x.counterpart} took less at the gate and gained more at the wharf.`,
    (x) => `Travellers report the gate on the ${x.route} keeps a shorter list now, and reads it faster.`,
    'The first wagons through paid the new rate without believing it, and came back the long way to check.',
    (x) => `The gate-clerk at the ${x.route} crossing has a new tariff board and the old one leaning against the wall behind it.`,
    (x) => `The long way round the ${x.route} has gone quiet, and the villages on it have begun asking ${x.counterpart} why.`,
  ],
  // cc.market_exclusion — notable, public
  commercial_market_exclusion: [
    (x) => `${x.settlement} shut its market to ${x.counterpart}'s ${x.good} and called it prudence.`,
    (x) => `The stalls at ${x.settlement} have no place for ${x.counterpart}'s carts now; the gate-clerks turn them at the bridge.`,
    (x) => `The licence register at ${x.settlement} no longer carries a single name out of ${x.counterpart}.`,
    (x) => `Shut out of ${x.settlement}, the ${x.good} of ${x.counterpart} must go the long way and arrive worth less for it.`,
    (x) => `It was published as an ordinance of quality, and every merchant in ${x.counterpart} read it correctly.`,
    (x) => `Carters turned at the bridge were back in ${x.counterpart} with the news before the ordinance had been copied out.`,
    'A trader who had sold in that market since their apprenticeship was handed the licence back at the gate.',
  ],
  // cc.market_opened — notable, public
  commercial_market_opened: [
    (x) => `${x.settlement} opened its market to ${x.counterpart}'s ${x.good}, and the bridge has been busy since.`,
    (x) => `The carters of ${x.counterpart} sleep in ${x.settlement}'s inns now, and the innkeepers have opinions about it.`,
    (x) => `The licence register at ${x.settlement} carries ${x.counterpart} names again, the first in a long while.`,
    (x) => `With the gate open, ${x.counterpart}'s ${x.good} sets the terms in ${x.settlement}'s stalls, and its rivals have noticed.`,
    (x) => `${x.settlement} called it a courtesy; the wharf calls it a windfall.`,
    (x) => `Word of the opening reached ${x.counterpart} before the couriers did, carried by carters who had already been through.`,
    (x) => `The gate-clerk at ${x.settlement} has a page of new names to learn and spells half of them wrong.`,
  ],
  // cc.cornering — major, public
  commercial_cornering: [
    (x) => `A house of ${x.counterpart} holds the ${x.good} that ${x.settlement} eats, and ${x.settlement} knows it.`,
    (x) => `In the market at ${x.settlement} the ${x.good} comes from one warehouse, and the warehouse stands in ${x.counterpart}.`,
    (x) => `The stall-books of ${x.settlement} record a single hand behind every sale of ${x.good} this season.`,
    (x) => `While ${x.house} holds the granaries of ${x.counterpart}, no bargain struck in ${x.settlement} is struck freely.`,
    (x) => `${x.counterpart} calls it a prudent stock; ${x.settlement} calls it a hand at the throat.`,
  ],
  // cc.provision — routine, public
  commercial_provision: [
    (x) => `${x.counterpart} sold ${x.settlement} the ${x.good} it needed, in the season it was needed.`,
    (x) => `The bread at ${x.settlement} came from ${x.counterpart}'s wagons this winter, and the bakers said so.`,
    (x) => `The granary book at ${x.settlement} names ${x.counterpart} in every entry of the lean months.`,
    (x) => `${x.settlement} owes ${x.counterpart} a full granary, and debts of that kind are remembered longest.`,
    (x) => `${x.counterpart} made no speech about it; the wagons arrived.`,
    (x) => `Carters down from ${x.counterpart} came in loaded and went back empty, and made nothing of it.`,
    (x) => `It is the lean months ${x.counterpart} sells into, and it has sold into them every year the clerks can name.`,
    (x) => `An old woman at the ${x.settlement} gate counted the wagons in and told her grandchildren whose they were.`,
    (x) => `At ${x.counterpart} the sale is a season's ordinary business; at ${x.settlement} it was the difference between a hard winter and a bad one.`,
  ],
  // cc.famine_profiteering — major, public
  commercial_famine_profiteering: [
    (x) => `${x.settlement} says ${x.house} sold dear to it while the granaries of ${x.counterpart} stood full.`,
    (x) => `In the bread queues of ${x.settlement} they name ${x.house}, and they do not say the name kindly.`,
    (x) => `The relief book at ${x.settlement} records what ${x.counterpart} asked for ${x.good} in the hungry season, and the clerks underlined it.`,
    (x) => `What ${x.counterpart} took from ${x.settlement} in the famine will be argued at every table for a generation.`,
    (x) => `${x.counterpart} calls it the market; ${x.settlement} lived through that winter and calls it something else.`,
  ],
  // cc.famine_relief — notable, public
  commercial_famine_relief: [
    (x) => `${x.counterpart} sent ${x.good} into ${x.settlement}'s hungry season and asked nothing at the gate.`,
    (x) => `The queues at ${x.settlement} thinned the week ${x.counterpart}'s wagons came, and the town has not forgotten which week.`,
    (x) => `The granary book at ${x.settlement} carries ${x.counterpart}'s name against the worst month of the year.`,
    (x) => `What ${x.counterpart} gave in the lean season will be spoken of when the next bargain is struck.`,
    (x) => `${x.counterpart} sent the ${x.good} quietly; ${x.settlement} has been loud about it ever since.`,
    (x) => `Carters on the road say they passed ${x.counterpart}'s wagons going the other way, loaded, and were waved through the toll.`,
    (x) => `A baker at ${x.settlement} kept one of ${x.counterpart}'s empty sacks nailed above the oven, and would tell you why.`,
  ],
  // cc.dependency_fear — notable, public
  commercial_dependency_fear: [
    (x) => `${x.settlement} buys its ${x.good} from ${x.counterpart} and from nowhere else, and the court has begun to say so aloud.`,
    (x) => `In the guildhall at ${x.settlement} they ask what happens to the bread if the ${x.route} closes.`,
    (x) => `The books at ${x.settlement} show one supplier of ${x.good} and no second name — a column that reads as a leash.`,
    (x) => `So long as ${x.counterpart} holds the only road for ${x.good}, every quarrel between them will be argued on ${x.counterpart}'s terms.`,
    (x) => `${x.counterpart} calls it a partnership; ${x.settlement} has begun to call it a rope, though not yet in public.`,
    (x) => `Travellers at the ${x.settlement} gate are asked how the harvest looked at ${x.counterpart}, and are asked before they are asked their business.`,
    'Every winter the question is put again in the guildhall, and every spring the wagons arrive and it is put away.',
  ],
  // cc.dependency_comfort — routine, public
  commercial_dependency_comfort: [
    (x) => `${x.settlement} buys its ${x.good} from ${x.counterpart} and sleeps the better for it.`,
    (x) => `The carters run the ${x.route} in all weather now; the road is a habit and not a venture.`,
    (x) => `The books at ${x.settlement} show one supplier of ${x.good} for years running, and not one lean month among them.`,
    (x) => `While the ${x.route} holds, ${x.settlement} has no need to court a second seller, and no wish to.`,
    (x) => `It is a dependence, and nobody in ${x.settlement} has thought to worry about it.`,
    (x) => `Strangers remark that the ${x.route} is busier than the towns at either end of it; neither town finds that strange.`,
    (x) => `Winter and summer alike the ${x.good} comes from ${x.counterpart}; the season changes the weather and nothing else.`,
    (x) => `Children at ${x.settlement} know the ${x.counterpart} carters by name, which is a kind of treaty nobody signed.`,
    (x) => `The guildhall at ${x.settlement} keeps no list of second sellers and has not been asked for one in years.`,
  ],
  // cc.contraband_injury — notable, public
  commercial_contraband_injury: [
    (x) => `The word in ${x.settlement} is that ${x.counterpart}'s gates pass contraband, and that ${x.settlement}'s losses begin there.`,
    (x) => `The carters say the ${x.route} out of ${x.counterpart} carries two cargoes, and only one of them is declared.`,
    (x) => `The assize at ${x.settlement} has heard the same complaint against ${x.counterpart} from a score of merchants.`,
    (x) => `Until ${x.counterpart} answers for its gates, ${x.settlement}'s wardens will search every cart off that road.`,
    (x) => `Nothing was proved. The market at ${x.settlement} settled the matter anyway.`,
    (x) => `Carters say the night traffic out of ${x.counterpart} is heavier than the day's, and say it where the wardens can hear.`,
    (x) => `The wardens of the towns down the ${x.route} have begun comparing their seizure books, and the same gate is named in all of them.`,
  ],
  // cc.honest_gates — routine, public
  commercial_honest_gates: [
    (x) => `${x.counterpart}'s gates are said to be clean, and ${x.settlement}'s merchants trade there without a second man watching.`,
    (x) => `The carters call the ${x.route} out of ${x.counterpart} a dull road, which from a carter is high praise.`,
    (x) => `The wardens' book at ${x.settlement} records no seizure out of ${x.counterpart} in a long season.`,
    (x) => `While ${x.counterpart}'s gates keep that name, ${x.settlement}'s factors will leave cargo on the quay overnight and expect to find it there.`,
    (x) => `${x.counterpart} has no reputation at all in this matter, and that is the reputation it wanted.`,
    (x) => `Merchants who have gone through worse gates make a point of mentioning ${x.counterpart}'s, which is rare praise from that trade.`,
    (x) => `Season after season the search at ${x.counterpart} takes the same short hour, and the carters have stopped budgeting for more.`,
    (x) => `The gate-wardens at ${x.counterpart} are said to hand back what they find and to look insulted when thanked.`,
    (x) => `${x.counterpart} pays its gate-wardens better than the law asks and counts their books oftener, and makes no announcement of either.`,
  ],
  // cc.route_predation — notable, public
  commercial_route_predation: [
    (x) => `${x.counterpart} lets the ${x.route} go unpoliced, and the wagons of ${x.settlement} pay the difference.`,
    (x) => `Season after season of losses on the ${x.route}, and the carters of ${x.settlement} name the same stretch of road.`,
    (x) => `The loss column for the ${x.route} in ${x.settlement}'s book is longer than the column for the sea.`,
    (x) => `While the ${x.route} stays unwardened, ${x.settlement}'s factors will price ${x.counterpart}'s goods for the risk of fetching them.`,
    (x) => `${x.counterpart} says the woods belong to nobody; ${x.settlement} agrees, and remembers who owns the road through them.`,
    'Travellers hire a second man for that stretch and do not think themselves timid for it.',
    (x) => `The inn at the head of the ${x.route} keeps a room for carters who turned back, and it is seldom empty.`,
  ],
  // cc.route_wardenship — routine, public
  commercial_route_wardenship: [
    (x) => `${x.counterpart} put patrols on the ${x.route}, and the wagons of ${x.settlement} began to arrive whole.`,
    (x) => `The carters say the ${x.route} is quiet now; they mean the woods and not the traffic.`,
    (x) => `The loss column for the ${x.route} in ${x.settlement}'s book has stood empty since ${x.counterpart} took the wardenship.`,
    (x) => `A policed road is worth a toll, and ${x.settlement}'s factors have stopped arguing about the toll.`,
    (x) => `${x.counterpart} calls it the upkeep of the road. This time the carters agree.`,
    (x) => `Travellers say there are patrol fires along the ${x.route} at night now, and that they slept.`,
    (x) => `The wardens ride the ${x.route} through the winter too, which is when it used to be worst.`,
    (x) => `A carter's wife at ${x.settlement} has stopped walking out to meet the evening wagons, and says so with some embarrassment.`,
    (x) => `The bands that worked the ${x.route} have moved to roads nobody wardens, and those towns have noticed.`,
  ],
  // cc.suppressed — routine, dm-only
  commercial_casus_suppressed: [
    (x) => `The grievance of ${x.reason} against ${x.counterpart} was set aside: the granaries it names stood empty on the day.`,
    (x) => `${x.settlement}'s complaint scored nothing; the read it rests on says the opposite.`,
    'The entry stands at nothing and stays in the book; if the granaries fill, it will be weighed again.',
    (x) => `Nobody at ${x.settlement} was told the claim of ${x.reason} scored nothing, or which read struck it out.`,
    (x) => `The court may say what it likes about ${x.counterpart}'s ${x.good}; the stock book says otherwise, and the stock book is the evidence.`,
    (x) => `The claim was weighed against the live read and failed it; nothing of ${x.reason} reaches the score.`,
    'Season after season the same grievance is entered and set aside, and the read that strikes it out never changes.',
    (x) => `${x.settlement} believes the grievance live and acts on it; the ledger has scored it at nothing since the day it was entered.`,
    "The clerk who struck it out wrote the read's name in the margin and nothing else.",
  ],
  // cc.severance_crossing — major, public
  commercial_severance_crossing: [
    (x) => `The tie between ${x.settlement} and ${x.counterpart} is cut, and the book gives ${x.reason} for it.`,
    'The bridge road stands empty of carts, and both towns have stopped blaming the weather.',
    (x) => `The licence registers at ${x.settlement} were closed against ${x.counterpart} this week, name by name.`,
    (x) => `With the tie cut, ${x.settlement} must find its ${x.good} elsewhere, and elsewhere is further.`,
    'It took one ordinance to end what took a generation to build.',
  ],
  // cc.partnership_crossing — notable, public
  commercial_partnership_crossing: [
    (x) => `${x.settlement} and ${x.counterpart} are trading partners in earnest now, and the ledgers on both sides say so.`,
    (x) => `There are ${x.counterpart} accents in ${x.settlement}'s market every week, and nobody remarks on them any more.`,
    (x) => `The book at ${x.settlement} shows ${x.counterpart} risen from an occasional name to the first name.`,
    (x) => `What binds them now in ${x.good} will be argued over when they next quarrel.`,
    'No treaty was signed. The wagons simply kept coming.',
    "It was a summer's convenience once, and it is how both towns eat now.",
    (x) => `There are marriages between the two quays, and ${x.settlement} has stopped calling ${x.counterpart}'s carters strangers.`,
  ],
  // dossier.trade_relation_line — routine, public
  commercial_relation_line: [
    (x) => `Trade with ${x.counterpart}: severed — they shut their market in the spring.`,
    (x) => `Trade with ${x.counterpart}: ${x.band} — ${x.good} moves both ways, and the road is policed.`,
    (x) => `Trade with ${x.counterpart}: strained — the toll on the ${x.route} has not come down since the quarrel.`,
    (x) => `Trade with ${x.counterpart}: none recorded; no cart has crossed in living memory.`,
    (x) => `Trade with ${x.counterpart}: ${x.band} — bound to their ${x.good}, and the guildhall says so uneasily.`,
    (x) => `Trade with ${x.counterpart}: severed — the reason recorded is ${x.reason}, and neither court disputes it.`,
    (x) => `Trade with ${x.counterpart}: ${x.band} — chiefly ${x.good}, and chiefly one way.`,
    (x) => `Trade with ${x.counterpart}: reviving — the first carts in a generation came up the ${x.route} last season.`,
    (x) => `Trade with ${x.counterpart}: ${x.band}, and seasonal; the ${x.route} is shut from the first frost to the thaw.`,
    (x) => `Trade with ${x.counterpart}: ${x.band} — steady for years, and nobody at the guildhall can name the year it began.`,
  ],
});

/**
 * The slots each variant actually interpolates, in pool order — the ORTHOGONAL WITNESS
 * (LEG-3, in its value-bearing form). The projector skips a variant whose named
 * evidence is absent rather than rendering a hole, and the walker re-derives this table
 * from the annex, so a pool row that gained or lost a slot cannot pass by accident.
 * @type {Readonly<Record<string, ReadonlyArray<readonly string[]>>>}
 */
export const COMMERCIAL_RECEIPT_SLOTS = Object.freeze({
  commercial_contract_default: [
    ['counterpart'],
    ['settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'good'],
    ['counterpart'],
    ['counterpart'],
    [],
  ],
  commercial_contract_honored: [
    ['counterpart', 'good'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'good'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
  ],
  commercial_toll_extortion: [
    ['counterpart', 'route', 'settlement'],
    ['route'],
    ['settlement'],
    ['counterpart', 'good', 'route', 'settlement'],
    ['counterpart'],
    ['counterpart'],
    [],
  ],
  commercial_toll_relief: [
    ['counterpart', 'route', 'settlement'],
    [],
    ['counterpart', 'route', 'settlement'],
    ['good', 'settlement'],
    ['counterpart'],
    ['route'],
    [],
    ['route'],
    ['counterpart', 'route'],
  ],
  commercial_market_exclusion: [
    ['counterpart', 'good', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'good', 'settlement'],
    ['counterpart'],
    ['counterpart'],
    [],
  ],
  commercial_market_opened: [
    ['counterpart', 'good', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'good', 'settlement'],
    ['settlement'],
    ['counterpart'],
    ['settlement'],
  ],
  commercial_cornering: [
    ['counterpart', 'good', 'settlement'],
    ['counterpart', 'good', 'settlement'],
    ['good', 'settlement'],
    ['counterpart', 'house', 'settlement'],
    ['counterpart', 'settlement'],
  ],
  commercial_provision: [
    ['counterpart', 'good', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart'],
    ['counterpart'],
    ['counterpart'],
    ['settlement'],
    ['counterpart', 'settlement'],
  ],
  commercial_famine_profiteering: [
    ['counterpart', 'house', 'settlement'],
    ['house', 'settlement'],
    ['counterpart', 'good', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
  ],
  commercial_famine_relief: [
    ['counterpart', 'good', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart'],
    ['counterpart', 'good', 'settlement'],
    ['counterpart'],
    ['counterpart', 'settlement'],
  ],
  commercial_dependency_fear: [
    ['counterpart', 'good', 'settlement'],
    ['route', 'settlement'],
    ['good', 'settlement'],
    ['counterpart', 'good'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    [],
  ],
  commercial_dependency_comfort: [
    ['counterpart', 'good', 'settlement'],
    ['route'],
    ['good', 'settlement'],
    ['route', 'settlement'],
    ['settlement'],
    ['route'],
    ['counterpart', 'good'],
    ['counterpart', 'settlement'],
    ['settlement'],
  ],
  commercial_contraband_injury: [
    ['counterpart', 'settlement'],
    ['counterpart', 'route'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['settlement'],
    ['counterpart'],
    ['route'],
  ],
  commercial_honest_gates: [
    ['counterpart', 'settlement'],
    ['counterpart', 'route'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart'],
    ['counterpart'],
    ['counterpart'],
    ['counterpart'],
    ['counterpart'],
  ],
  commercial_route_predation: [
    ['counterpart', 'route', 'settlement'],
    ['route', 'settlement'],
    ['route', 'settlement'],
    ['counterpart', 'route', 'settlement'],
    ['counterpart', 'settlement'],
    [],
    ['route'],
  ],
  commercial_route_wardenship: [
    ['counterpart', 'route', 'settlement'],
    ['route'],
    ['counterpart', 'route', 'settlement'],
    ['settlement'],
    ['counterpart'],
    ['route'],
    ['route'],
    ['settlement'],
    ['route'],
  ],
  commercial_casus_suppressed: [
    ['counterpart', 'reason'],
    ['settlement'],
    [],
    ['reason', 'settlement'],
    ['counterpart', 'good'],
    ['reason'],
    [],
    ['settlement'],
    [],
  ],
  commercial_severance_crossing: [
    ['counterpart', 'reason', 'settlement'],
    [],
    ['counterpart', 'settlement'],
    ['good', 'settlement'],
    [],
  ],
  commercial_partnership_crossing: [
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['counterpart', 'settlement'],
    ['good'],
    [],
    [],
    ['counterpart', 'settlement'],
  ],
  commercial_relation_line: [
    ['counterpart'],
    ['band', 'counterpart', 'good'],
    ['counterpart', 'route'],
    ['counterpart'],
    ['band', 'counterpart', 'good'],
    ['counterpart', 'reason'],
    ['band', 'counterpart', 'good'],
    ['counterpart', 'route'],
    ['band', 'counterpart', 'route'],
    ['band', 'counterpart'],
  ],
});
