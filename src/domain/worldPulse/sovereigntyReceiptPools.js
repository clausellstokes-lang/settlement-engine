/**
 * domain/worldPulse/sovereigntyReceiptPools.js — THE WR-10 SOVEREIGNTY-MARKET RECEIPT PROSE.
 *
 * A PURE DATA LEAF of the event-prose family (ruling R-BLD-4: the single-writer law reads
 * ONE WRITER FAMILY, never one file), sibling to warReceiptPools.js. It holds ONLY the
 * authored corpora the WR-10 pickers draw from; `sovereigntyNews.js` owns the registry
 * rows, the picker, and the reader projection.
 *
 * WHY A SEPARATE FILE FROM warReceiptPools.js. Measured, not stylistic: warReceiptPools.js
 * stands at 674 effective lines against the 800 domain ceiling, and these fifteen pools are
 * ~105 effective lines. Landing them there would leave the war corpus ~21 lines of headroom
 * and put the next content batch straight into a decomposition it did not cause. The corpus
 * grows without bound by design (that is warReceiptPools' own stated reason for existing);
 * a wave-scoped corpus therefore gets a wave-scoped file.
 *
 * ANNEX-VERBATIM. Every line below is byte-identical to its authored variant in
 * docs/content/RECEIPT_POOLS_WAR.md under `# WR-10 — THE SOVEREIGNTY MARKET`, with only the
 * `{slot}` tokens turned into interpolations. The pools were EXTRACTED from the annex
 * mechanically rather than transcribed, and tests/lint/sovereigntyKindPools.walker.test.js
 * re-derives them from the document on every run, so a hand edit here reds rather than
 * silently forking the corpus away from the content program.
 *
 * THE FREQUENCY-SCALED FLOOR (SP-6 amendment) is met by the annex as authored, measured:
 * routine kinds carry ten (`sovereignty_no_trade`, `streams_rerouted`), notable six, major
 * five. Each pool also carries at least one SLOTLESS variant, so a receipt whose named
 * evidence is absent still has an honest authored fallback instead of a fabricated name.
 *
 * PURE DATA: frozen literals and interpolation lambdas only — no Date, no Math.random, no
 * store, no I/O, no imports beyond the shared variant type.
 *
 * @enforced-by tests/lint/sovereigntyKindPools.walker.test.js
 */

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/** @type {Readonly<Record<string, readonly ProseVariant[]>>} */
export const SOVEREIGNTY_RECEIPTS = Object.freeze({
  sovereignty_sale_offered: [
    (x) => `${x.counterpart} has offered ${x.settlement} for sale, and the bundle on the table is ${x.good}, allyship, and ${x.route}.`,
    'The asset is a satellite and the seller says so plainly; free towns are not for sale, and everyone repeats it.',
    'A settlement is a treaty like any other, drafted by the same clerks on the same paper.',
    'The offer went out to the halls that could actually hold it, which is a short list.',
    'What is being sold is an edge on a map and a great many people who were not asked.',
    (x) => `The word reached ${x.settlement} the ordinary way, from a carter who had heard it at the far end of ${x.route}.`,
  ],
  sovereignty_sale_cleared: [
    (x) => `The trade cleared: ${x.counterpart}'s reserve was met and ${x.third_party}'s ceiling was not reached.`,
    (x) => `${x.settlement} changed overlords for ${x.good}, ${x.route}, and a compact, and none of it moved a soul.`,
    'Both halls valued the bundle through their own needs and the values overlapped, which is all a bargain is.',
    'It was signed in an afternoon and will be argued about for a generation.',
    'A town was sold. The town found out afterward.',
  ],
  sovereignty_no_trade: [
    (x) => `The machinery ran and produced nothing: ${x.counterpart} would not take what ${x.third_party} could bear to give.`,
    'The buyer reached its ceiling before the seller reached its reserve, and both walked away polite.',
    (x) => `The bundle was stacked as high as it would go and stood ${x.band} short.`,
    'There was no bargain, and the absence is on the record with the reason.',
    "What the buyer offered, the seller's needs valued at nothing; appropriateness is not a rule anyone can write.",
    (x) => `${x.settlement} learned it had been offered and not taken, which is a strange thing for a town to carry.`,
    'The factors went home by the road they came, and the drovers read the whole affair off their faces.',
    'Nothing happened. It took a season and a great deal of paper.',
    (x) => `The offer can be made again at another price, and ${x.counterpart} and ${x.third_party} both know it.`,
    'The clerks entered a bundle, a reserve, and a refusal, and closed the file with no transfer under it.',
  ],
  sovereignty_swap: [
    (x) => `${x.counterpart} and ${x.third_party} exchanged satellites, and each thinks it got the better of it.`,
    (x) => `${x.settlement} went one way and a town of its size went the other, along roads neither will use again.`,
    'The swap was symmetric on paper and never on the ground.',
    'Each overlord solved a problem and made one for the towns.',
    'Nobody moved. Everything changed.',
  ],
  cession_for_peace: [
    (x) => `${x.counterpart} ceded ${x.settlement} to end the war, and the cession rode home in an envoy's sheet.`,
    'The town was the price of the peace, and the town was not consulted.',
    'What could not be held was traded for what could not be won.',
    'The terms name the settlement, the reason, and both seats; the clerks were careful about that.',
    (x) => `A war ended and a grievance began, in the same document, for ${x.reason}.`,
  ],
  sovereignty_edge_rewritten: [
    (x) => `${x.settlement}'s overlord is ${x.third_party} now; the people are the same people and the tolls go elsewhere.`,
    'The edge on the map was rewritten and the lineage edge was kept, which will matter later.',
    (x) => `Nobody moved house. The wagons take ${x.route} instead.`,
    'The charter chest changed halls; the reeve did not change.',
    'What was owed to one seat is owed to another, and the owing is unchanged.',
    'The seal above the assize door was changed in an afternoon; the door is the door it always was.',
  ],
  sold_settlement_grievance: [
    (x) => `${x.settlement} was sold and has said so, at length, in every hall that will hear it.`,
    'The town keeps a grievance against the seat that sold it and a suspicion of the seat that bought it.',
    'Being traded is a wound no treaty term addresses.',
    'They were a possession in the record and have now read the record.',
    (x) => `The grievance is fresh, named, and pointed at ${x.counterpart}, which sold them.`,
  ],
  bought_seat_fragility: [
    (x) => `${x.third_party} holds ${x.settlement} and holds it thinly; the new seat's standing reads ${x.band}, and revolt stands with it.`,
    'Bought authority starts where earned authority ends up after a bad war.',
    'The garrison is small and the compliance is polite, and neither is a settlement.',
    'They own the town and negotiate with it weekly.',
    'Nothing was conquered, so nothing was decided.',
    'The first hard season will be the test, and the neighbours have already worked out which season that is.',
  ],
  lineage_survives_the_sale: [
    (x) => `${x.counterpart} sold ${x.settlement} and remains its founder in the record, which is a claim in waiting.`,
    'The lineage edge survives the sale as history, and history is a casus.',
    "A seller's remorse has a name and a charter behind it.",
    (x) => `The town it seeded answers to ${x.third_party} now and still remembers whose granary fed it.`,
    'Independence and reclamation are mintable from the same entry, which is the joke.',
    'The founding entry was not in the bundle, because nobody thought to put it there.',
  ],
  wartime_firesale: [
    (x) => `${x.counterpart} sold ${x.settlement} in the middle of its war, and the price says exactly what the buyer believes about its trajectory.`,
    'A wartime sale is legal, discounted, and read by everyone.',
    (x) => `The seller took ${x.band} of what the town was worth in peacetime, and took it gladly.`,
    'Nobody buys at that price out of charity.',
    (x) => `${x.third_party} is wagering that the decline continues and has put wagons behind the wager.`,
    (x) => `${x.settlement} has learned what its own overlord thought of its prospects, and learned it in public.`,
  ],
  sovereignty_sale_judged: [
    (x) => `${x.counterpart} sold ${x.settlement} to a hall that has burned towns, and the courts have noticed.`,
    "Selling is ordinary; selling to that buyer is not, and the observer's axis decides which it was.",
    (x) => `The ${x.temple} spoke about it, which it does not do about ordinary contracts.`,
    'The price was good and the standing was expensive.',
    (x) => `Some halls will not receive ${x.counterpart}'s factors this season and have not said why.`,
    'The judgment will outlive the compact, as judgments do, and the compact was not drafted to last.',
  ],
  kinship_opposes_the_sale: [
    (x) => `${x.counterpart}'s council would not sell ${x.settlement}: the founding bond outweighed the bundle, and the bundle was good.`,
    (x) => `They seeded that town and would not put a price on it, which ${x.house} found sentimental and expensive.`,
    'Kinship is a valuation like any other, and it valued this above grain.',
    'The offer was refused without a counter, which says everything.',
    'What a house will not sell is a fact about the house.',
    'The offer has not been withdrawn, and the council has not stopped having to hear it.',
  ],
  sale_books_diverged: [
    (x) => `${x.npc} sold ${x.settlement} to save the seat; the town's books and the seat's books wanted opposite things, and the seat signed.`,
    'The family silver went out the door on a bad afternoon and bought a quiet council.',
    'The realm lost a satellite and the ruler kept a hall, and the record is plain about which of the two was being served.',
    'It was necessary for exactly one person in the room.',
    'Nobody argues it was a good bargain. They argue about who it was good for.',
  ],
  overflow_valve_sold: [
    (x) => `${x.counterpart} sold the steading its overflow used to go to, and the overflow has nowhere to go.`,
    'The valve was worth more than the price, and the council knows it now.',
    (x) => `They are ${x.band} over their ceiling and out of land they can call their own.`,
    'A satellite is a place to put people, and the ledger had no column for that.',
    'The squeeze arrived a generation after the sale, on schedule and unforeseen.',
    "The younger sons who would have gone out to that steading are still at their fathers' tables.",
  ],
  streams_rerouted: [
    (x) => `The ${x.good} that went to ${x.counterpart} goes to ${x.third_party} now, by the same carts and a longer road.`,
    (x) => `${x.settlement}'s tribute rides ${x.route} these days, and the drovers have opinions about it.`,
    'The caravans changed destination and nothing else changed.',
    (x) => `The wharf at ${x.counterpart} is quieter than it was, and the quiet has a cause with a name.`,
    'Streams follow the edge, and the edge moved.',
    'The carter who has driven that load since he was a boy turns left at the crossing now.',
    (x) => `The toll book at ${x.counterpart} shows the same goods passing and none of the takings.`,
    (x) => `A ${x.route} that carries nothing for a season stops being mended, and the mending is what costs.`,
    'It took a single season for the new arrangement to look like the old one.',
    (x) => `At ${x.third_party} the arrivals are entered as though they had always come, and in a generation the books will agree.`,
  ],
});
