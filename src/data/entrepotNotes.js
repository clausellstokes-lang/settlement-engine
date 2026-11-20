/**
 * src/data/entrepotNotes.js — THE CHAIN CARDS' ENTREPÔT NOTE, a declared pool a chain (PLACE-1's second unit, 2026-11-20;
 * the owner's order "comprehensively fix the sameness fault"; `docs/chair/2026-11-20/content/place/BRIEF-BUILD-entrepotNote.md`,
 * the chair's ruling of 17:18 UTC, and `entrepotNote-MEASURE.md` §D and §F).
 *
 * The note (`economicState.activeChains[].entrepotNote`) was one fixed sentence a chain, copied from the catalogue
 * (`supplyChainData.js :: SUPPLY_CHAIN_NEEDS`) by `computeActiveChains`: the luxury note in 81 of 100 cities, the fur note
 * in 76 of 100 metropolises. It prints under a chain's card on the Economics tab's Economic Flows
 * (`EconomicsTab.jsx :: EconomicFlowsSection`) and in the PDF's chain cards (`Services.jsx :: ChainCard`).
 *
 * THE POOLS (`ENTREPOT_NOTES`, keyed by chain id as the catalogue keys its chains). Row 0 of every pool is TODAY'S SENTENCE,
 * read from the chain at compose time (the catalogue keeps it; it is never copied here), and it declares the route its own
 * words claim ("Port and crossroads settlements…"): the chair's call (3), truth outranks canonical-at-zero, so a seeded
 * draw takes it only where that claim holds. Every other row declares what it says (`drawDeclared.js`'s shape):
 *   `route: <kind>`      a row that names the place's road, river, sea or crossing;
 *   `carrier: own`       a row that says the chain's ground is the place's own; it names the record's own resource label
 *                        through `{resource}` (the chair's call (1)), never a fixed noun;
 *   `carrier: transit`   a row that says the good comes from elsewhere, wherever the chain can be the place's own (salt,
 *                        furs, luxury goods, enchanted goods; the chair's call (2), widened);
 *   `market`, `institution: bank`   a row that names the market or a bank;
 *   `imports` / `exports`   THE CLASS DECLARATIONS (PLACE-2's cure, the chair's ruling (2) of 18:52 UTC: "a fresh builder reads
 *                        the walker and DECLARES each class a row fits"): a row whose words fall in the presumption-classes
 *                        walker's goods or outside class declares the trade it presumes, `imports` where it says the good is
 *                        brought or bought in, `exports` where it says the good is taken, made or sent on from here (both where
 *                        it says both); each held wherever its chain's note is held on the census's 600 births;
 *   `prosperity: ≥ poor`   silk-steady's "a steady trade" (the walker's work class), the one class not answered by a trade.
 * THE FOUR OPEN-TRADE ROWS ARE DROPPED (the chair's ruling (3) of 18:52 UTC; salt-wanted, lux-value, wine-through, fin-lend:
 * "... passes through here"). The walker's own open-trade atom exists (`registeredWords.js :: STATE_FAMILIES.openTrade`: true
 * where no siege is in force, answered by `excludes: ['crisis: under_siege']`), but the draw cannot hold it: the record the
 * call line hands the composer (`steps/economyReconcilePass.js`: config, economicState, institutions, tier) carries no
 * crisis, so a sieged place stored them all the same (hxd-metropolis-98: lux-value and fin-lend, refused on its final record).
 * `carrier` is the chain-scoped atom the chair granted ("ATOM carrier: own|transit : src/domain/facts/chainCarrier.js ::
 * chainCarrierOf : chain-scoped"): the draw hands the chain as `ctx.chain`.
 * Two luxury rows name goods (fine metalwork, jewellery): they say so only where the chain's own record names them
 * (`namesGoods`), and `costly goods` alone otherwise (the chair's condition (a)).
 *
 * THE DRAW. `entrepotNotesOf(chains, record, seed)` draws each noted chain's row once through `drawDeclared` over the
 * mixed keyed pick (`kernel/proseHash.js :: pickVariantMixed`, key `${seed}::entrepotNote::${chainId}`): no roll, so the
 * random stream does not move. A falsy seed hands the chains back untouched (canonical at zero), so every seedless caller
 * (`computeActiveChains` itself, the world-pulse kernels, a unit test) keeps today's sentence. Called once, by
 * `steps/economyReconcilePass.js`, after the chains' final writer; a SAVED town keeps its stored note (nothing here runs at
 * render).
 *
 * Pure apart from the pick; consumes no randomness.
 *
 * @enforced-by tests/generators/entrepotNoteSpread.test.js
 */
import { drawDeclared } from '../domain/facts/drawDeclared.js';
import { factsOf } from '../domain/facts/factsOf.js';
import { chainCarrierOf } from '../domain/facts/chainCarrier.js';
import { pickVariantMixed } from '../kernel/proseHash.js';

/** The slot an own row fills with the record's own resource label (the chair's call (1)). */
export const RESOURCE_SLOT = '{resource}';

/** Index 0 of every pool: today's sentence, the chain's own (read at compose time). @param {string} note @returns {string} */
const today = (note) => note;

/**
 * @typedef {object} EntrepotNoteRow
 * @property {string} id
 * @property {string | ((note: string) => string)} text
 * @property {ReadonlyArray<string>} [needs]
 * @property {ReadonlyArray<string>} [excludes]
 * @property {ReadonlyArray<string>} [namesGoods] the chain outputs the text names; absent from the chain's record, `otherwise` prints
 * @property {string} [otherwise]
 */

/** @type {Readonly<Record<string, ReadonlyArray<EntrepotNoteRow>>>} */
export const ENTREPOT_NOTES = deepFreeze({
  salt: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: river', 'route: isolated', 'route: mountain_pass'] },
    { id: 'salt-port', needs: ['route: port', 'carrier: transit'], text: 'Salt comes in by sea and goes on inland from here, and the place keeps a share of every load.' },
    { id: 'salt-river', needs: ['route: river'], text: 'Salt moves up and down the river, and some of every load is sold off here.' },
    { id: 'salt-crossroads', needs: ['route: crossroads', 'carrier: transit'], text: 'Salt comes in on one road and leaves on another, and the place takes its cut between.' },
    { id: 'salt-road', needs: ['route: road', 'carrier: transit'], text: 'Salt comes in by road and is sold on from here to the places further along.' },
    { id: 'salt-own', needs: ['carrier: own'], text: 'Much of the salt sold here is its own, taken from the {resource} nearby.' },
    { id: 'salt-own-keep', needs: ['carrier: own'], text: '{resource} nearby supply the salt, for preserving food here and for selling on.' },
    { id: 'salt-transit', needs: ['carrier: transit'], text: 'No salt is taken here; it is brought in, and sold on or used to preserve food.' },
    { id: 'salt-bought', needs: [], text: 'Salt is bought and sold here in quantity, for preserving food and for selling on.' },
  ],
  furs_north: [
    { id: 'canonical', text: today },
    { id: 'furs-port', needs: ['route: port', 'exports'], text: 'Furs are gathered here and shipped on by sea.' },
    { id: 'furs-river', needs: ['route: river', 'carrier: transit', 'imports'], text: 'Furs come down the river in bales and change hands here before going on.' },
    { id: 'furs-crossroads', needs: ['route: crossroads', 'carrier: transit', 'imports'], text: 'Furs from several directions meet here, where the roads cross, and are sold on.' },
    { id: 'furs-road', needs: ['route: road', 'carrier: transit', 'imports'], text: 'Furs come in along the road and change hands here before going on.' },
    { id: 'furs-own', needs: ['carrier: own', 'exports'], text: 'Many of the furs sold here are taken on the place\'s own {resource}.' },
    { id: 'furs-own-rest', needs: ['carrier: own', 'exports'], text: 'Furs and pelts come off the {resource} nearby, and what is not used here is traded on.' },
    { id: 'furs-transit', needs: ['carrier: transit', 'imports'], text: 'None of these furs are taken here; they come from hunting grounds elsewhere and are traded on.' },
    { id: 'furs-through', needs: ['carrier: transit', 'imports', 'exports'], text: 'Furs pass through here on their way to buyers elsewhere, and the place takes a share of the trade.' },
    { id: 'furs-steady', needs: ['exports'], text: 'The fur trade is steady here, in pelts and the leather made from them.' },
    { id: 'furs-regular', needs: ['imports', 'exports'], text: 'Furs and pelts are a regular part of the trade here.' },
    // the chair's ruling (1) of 18:52 UTC: two more furs rows with no needs, in the pool's voice (the metropolis's bar)
    { id: 'furs-among', needs: ['imports', 'exports'], text: 'Furs and pelts are among the goods bought and sold here.' },
    { id: 'furs-leather', needs: ['exports'], text: 'Some of the pelts here go to make leather goods, and the rest are sold on as they are.' },
  ],
  luxury_goods: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: isolated', 'route: mountain_pass'] },
    { id: 'lux-port', needs: ['route: port', 'carrier: transit'], text: 'Fine goods arrive by sea, and are sold here and inland at a good markup.' },
    { id: 'lux-river', needs: ['route: river', 'carrier: transit'], text: 'Fine goods come up the river to be sold here, and the markup on them is high.' },
    { id: 'lux-crossroads', needs: ['route: crossroads', 'carrier: transit'], text: 'Fine goods from several directions meet here where the roads cross, and are sold on at a markup.' },
    { id: 'lux-road', needs: ['route: road', 'carrier: transit'], text: 'Fine goods come in by road from far away, and are sold here at a good markup.' },
    { id: 'lux-own', needs: ['carrier: own'], text: 'The luxury trade here begins with the {resource} nearby.' },
    { id: 'lux-transit', needs: ['carrier: transit'], text: 'Little of the luxury trade here starts here: fine goods are brought in and sold on at a markup.' },
    { id: 'lux-far', needs: [], text: 'Luxury goods are carried far, and part of what they earn on the way is earned here.' },
    { id: 'lux-kinds', needs: ['exports'], text: 'The luxury trade here is in fine metalwork, jewellery and other costly goods.', namesGoods: ['Fine metalwork and jewelry'], otherwise: 'The luxury trade here is in costly goods.' },
    { id: 'lux-price', needs: [], text: 'Costly goods travel long distances, and every place they pass through adds to the price.' },
    { id: 'lux-market', needs: ['market'], text: 'Costly goods, jewellery and fine metalwork among them, are sold in the market here.', namesGoods: ['Fine metalwork and jewelry'], otherwise: 'Costly goods are sold in the market here.' },
  ],
  spices_dyes: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: river', 'route: isolated', 'route: mountain_pass'] },
    { id: 'spice-port', needs: ['route: port', 'imports'], text: 'Spices and dyes come in by sea from distant lands, and are sold on inland from here.' },
    { id: 'spice-river', needs: ['route: river', 'imports'], text: 'Spices and dyes come up the river from distant lands, and are sold on from here at a markup.' },
    { id: 'spice-crossroads', needs: ['route: crossroads', 'imports'], text: 'Spices and dyes from distant lands reach the crossing roads here and are sold on in every direction.' },
    { id: 'spice-road', needs: ['route: road', 'imports'], text: 'Spices and dyes come in along the road from far away and are sold on at a markup.' },
    { id: 'spice-far', needs: ['imports'], text: 'Nothing in this trade is grown here: the spices and dyes come from far away and pass on at a profit.' },
    { id: 'spice-light', needs: ['imports'], text: 'Spices and dyes are light, costly and carried far, and part of their price is added here.' },
    { id: 'spice-others', needs: ['imports'], text: 'The spice and dye trade here is a trade in other places\' goods, bought in and sold on.' },
    { id: 'spice-bulk', needs: ['imports'], text: 'Spices and dyes are a small trade here by bulk, and a profitable one.' },
    { id: 'spice-market', needs: ['market', 'imports'], text: 'Spices and dyes from far away are sold in the market here, and some are carried on.' },
  ],
  silk_luxury_textiles: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: river', 'route: isolated', 'route: mountain_pass'] },
    { id: 'silk-port', needs: ['route: port', 'imports'], text: 'Silk arrives by sea, and from here it is carried inland to be sold.' },
    { id: 'silk-river', needs: ['route: river', 'imports'], text: 'Silk comes up the river to be sold here, or carried further on.' },
    { id: 'silk-crossroads', needs: ['route: crossroads', 'imports'], text: 'Silk reaches the crossing roads here and is sent on inland in several directions.' },
    { id: 'silk-road', needs: ['route: road', 'imports'], text: 'Silk comes in by road from far away, and is sold here or carried on.' },
    { id: 'silk-none', needs: ['imports'], text: 'No silk is made here; it is brought from far away, and fine cloth is sold on from here.' },
    { id: 'silk-long', needs: ['imports'], text: 'Silk is carried a long way to reach this place, and it is sold on at a good price.' },
    { id: 'silk-trade', needs: ['imports'], text: 'The silk trade here is a trade in fine cloth bought from far away and sold on.' },
    { id: 'silk-market', needs: ['market', 'imports'], text: 'Silk and other fine cloth from far away are sold in the market here.' },
    { id: 'silk-steady', needs: ['imports', 'prosperity: ≥ poor'], text: 'Fine cloth from far away is a steady trade here, silk among it.' },
    { id: 'silk-bales', needs: ['imports'], text: 'Bales of silk are bought here from those who have carried them far, and sold on.' },
  ],
  wine_spirits: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: crossroads', 'route: isolated', 'route: mountain_pass'] },
    { id: 'wine-port', needs: ['route: port', 'imports'], text: 'Wine comes in by sea in casks, and is sold here or carried on inland.' },
    { id: 'wine-river', needs: ['route: river', 'imports'], text: 'Wine comes down the river in casks, and is sold here and further on.' },
    { id: 'wine-crossroads', needs: ['route: crossroads', 'imports'], text: 'Wine from more than one region meets here where the roads cross, and is sold on.' },
    { id: 'wine-road', needs: ['route: road', 'imports'], text: 'Wine comes in by road from far away, and is sold here and further on.' },
    { id: 'wine-cask', needs: ['imports'], text: 'Wine is bought in by the cask here, and much of it is sold on.' },
    { id: 'wine-few', needs: ['imports'], text: 'Wine is drunk everywhere and made in few places, and some of the trade between them runs through here.' },
    { id: 'wine-tavern', needs: ['imports'], text: 'Some of the wine coming through is drunk here; the rest is sold on.' },
  ],
  // The chair's condition (b): see CHAIN_SCOPED_POOLS below.
  smuggling: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: isolated', 'route: mountain_pass'] },
    { id: 'smug-port', needs: ['route: port'], text: 'Some cargo comes ashore here without being declared, and is sold on quietly.' },
    { id: 'smug-river', needs: ['route: river'], text: 'Some goods come and go on the river without being declared, and are sold quietly here.' },
    { id: 'smug-crossroads', needs: ['route: crossroads'], text: 'Some goods pass through the crossing roads here undeclared and untaxed.' },
    { id: 'smug-road', needs: ['route: road'], text: 'Some goods come in by road undeclared, and are sold on quietly.' },
    { id: 'smug-loads', needs: [], text: 'Not every load that passes through here is declared, and some goods are sold where no tax is paid.' },
    { id: 'smug-quiet', needs: [], text: 'Alongside the honest trade runs a quieter one, in goods that pay no tax.' },
    { id: 'smug-duty', needs: [], text: 'Some of the trade here is smuggled: goods that pay no duty, moved by people who keep quiet about it.' },
  ],
  magical_goods: [
    { id: 'canonical', text: today },
    { id: 'magic-port', needs: ['route: port', 'carrier: transit'], text: 'Enchanted goods come in by sea and are sold here at a high price.' },
    { id: 'magic-river', needs: ['route: river', 'carrier: transit'], text: 'Enchanted goods come up the river and are sold here at a high price.' },
    { id: 'magic-crossroads', needs: ['route: crossroads', 'carrier: transit'], text: 'Enchanted goods from several directions meet here where the roads cross, and fetch a high price.' },
    { id: 'magic-road', needs: ['route: road', 'carrier: transit'], text: 'Enchanted goods come in by road and are sold here at a high price.' },
    { id: 'magic-own', needs: ['carrier: own'], text: 'The enchanted goods sold here begin at the {resource} nearby, and go on to buyers elsewhere.' },
    { id: 'magic-transit', needs: ['carrier: transit'], text: 'Most enchanted goods sold here are brought in from elsewhere, at a high price.' },
    { id: 'magic-weight', needs: [], text: 'Enchanted goods are worth a great deal for their weight, and some of that trade is done here.' },
    { id: 'magic-small', needs: [], text: 'The trade in enchanted goods is small but valuable, and buyers come here for it.' },
    { id: 'magic-hands', needs: [], text: 'Enchanted goods change hands here at high prices.' },
  ],
  transit_finance: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: isolated', 'route: mountain_pass'] },
    { id: 'fin-port', needs: ['route: port'], text: 'Merchants landing cargo here settle their accounts and borrow against it before moving on.' },
    { id: 'fin-river', needs: ['route: river'], text: 'River traders settle their accounts here and borrow against their cargo.' },
    { id: 'fin-crossroads', needs: ['route: crossroads'], text: 'Traders meeting at the crossing roads here settle accounts and borrow against their loads.' },
    { id: 'fin-road', needs: ['route: road'], text: 'Traders on the road settle their accounts here and borrow against their loads.' },
    { id: 'fin-bank', needs: ['institution: bank'], text: 'The bank here lends to traders and changes their money, and earns from trade it does not carry.' },
    { id: 'fin-credit', needs: [], text: 'Large loads need credit, and the lending here grows with the trade passing through.' },
    { id: 'fin-settle', needs: [], text: 'Traders passing through borrow, settle and change money here, and that business pays.' },
  ],
  warehouse_logistics: [
    { id: 'canonical', text: today, excludes: ['route: road', 'route: river', 'route: isolated', 'route: mountain_pass'] },
    { id: 'store-port', needs: ['route: port'], text: 'Cargo landed from the sea is stored here and sent on, for a fee.' },
    { id: 'store-river', needs: ['route: river'], text: 'Cargo is unloaded from the river here, stored and sent on, and the place is paid for the handling.' },
    { id: 'store-crossroads', needs: ['route: crossroads'], text: 'Loads coming in on one road are stored here and sent out on another, for a fee.' },
    { id: 'store-road', needs: ['route: road'], text: 'Loads are stored here and sent on along the road, for a fee.' },
    { id: 'store-others', needs: [], text: 'Much of the work here is storing other people\'s goods and loading them for the next leg.' },
    { id: 'store-handling', needs: [], text: 'Goods are stored, loaded and sent on from here; the earnings are in the handling.' },
    { id: 'store-little', needs: [], text: 'The place makes little of what it handles; it is paid to store and move it.' },
  ],
});

/**
 * THE CHAIR'S CONDITION (b), 17:18 UTC: the smuggling pool's rows are about crime. They are exempt from the hideable rule
 * BY THIS DECLARATION only because they print on that chain's own card and nowhere else: the note is a field of its chain,
 * printed inside that chain's card alone, so a read that withholds the smuggling chain withholds its note with it.
 */
export const CHAIN_SCOPED_POOLS = Object.freeze({
  smuggling: 'printed inside its own chain card only: src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection (the card of each chain it is handed) and src/pdf/sections/Services.jsx :: ChainCard (one card a chain)',
});

/**
 * The resource label filled into a row's slot: as the record spells it at the head of a sentence, lower-cased in it.
 * @param {string} text @param {string} label
 */
function fillResource(text, label) {
  const at = text.indexOf(RESOURCE_SLOT);
  const word = at === 0 ? label : label.charAt(0).toLowerCase() + label.slice(1);
  return text.slice(0, at) + word + text.slice(at + RESOURCE_SLOT.length);
}

/**
 * A chain's pool (`null` for a chain with no pool). @param {any} chain
 * @returns {ReadonlyArray<EntrepotNoteRow> | null}
 */
export function entrepotNotePoolOf(chain) {
  return chain && typeof chain.chainId === 'string' && Object.prototype.hasOwnProperty.call(ENTREPOT_NOTES, chain.chainId) ? ENTREPOT_NOTES[chain.chainId] : null;
}

/**
 * One row's text as it prints for this chain in this record: today's sentence at index 0; the record's own resource label
 * in an own row's slot; the luxury rows' goods named only where the chain's record names them. An own row whose slot the
 * record cannot fill keeps its slot, and the composer never prints it.
 * @param {EntrepotNoteRow} row
 * @param {any} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record (or the step's partial: `{ config, economicState, institutions, tier }`)
 * @param {string} note today's sentence (the composer reads the chain's own)
 * @returns {string}
 */
export function entrepotNoteTextOf(row, chain, record, note) {
  let text = typeof row.text === 'function' ? row.text(note) : row.text;
  const outputs = Array.isArray(chain?.outputs) ? chain.outputs.map(String) : [];
  if (row.namesGoods && typeof row.otherwise === 'string' && !row.namesGoods.every((g) => outputs.includes(g))) text = row.otherwise;
  if (text.includes(RESOURCE_SLOT)) {
    const label = chainCarrierOf(chain, record).resource;
    if (typeof label === 'string' && label) text = fillResource(text, label);
  }
  return text;
}

/**
 * One chain's note: its pool's row drawn by the mixed keyed pick over the declared rows and resolved by the record
 * (`drawDeclared`), then filled for the chain. A falsy seed, a chain with no pool, or a row that could not be filled keeps
 * the chain's own note.
 * @param {any} chain @param {unknown} record @param {unknown} seed
 * @param {object | (() => object)} [facts] `factsOf(record)`, or a thunk to it
 * @returns {string | null | undefined}
 */
export function entrepotNoteOf(chain, record, seed, facts = () => factsOf(record)) {
  const pool = seed && typeof chain?.entrepotNote === 'string' && chain.entrepotNote ? entrepotNotePoolOf(chain) : null;
  if (!pool) return chain?.entrepotNote;
  const seedKey = `${seed}::entrepotNote::${chain.chainId}`;
  const r = drawDeclared(pool, { facts, draw: (p) => pickVariantMixed(p, seedKey), key: seedKey, poolId: `entrepotNotes.${chain.chainId}`, surface: 'economics', drawKind: 'H', ctx: { chain } });
  const text = r.line ? entrepotNoteTextOf(r.line, chain, record, chain.entrepotNote) : null;
  return typeof text === 'string' && text && !text.includes(RESOURCE_SLOT) ? text : chain.entrepotNote;
}

/**
 * Every noted chain's note, drawn from its pool. A falsy seed hands `chains` back untouched; a chain whose note does not
 * change is handed back as it was; one whose note changes is a copy with its new note (nothing else is written).
 * @template T
 * @param {T} chains `economicState.activeChains`
 * @param {unknown} record the settlement record (or the step's partial)
 * @param {unknown} seed the birth's seed
 * @returns {T}
 */
export function entrepotNotesOf(chains, record, seed) {
  if (!seed || !Array.isArray(chains)) return chains;
  /** @type {object | null} */ let facts = null;
  const factsOnce = () => (facts ??= factsOf(record));
  return /** @type {T} */ (/** @type {unknown} */ (chains.map((c) => {
    if (!c || !c.entrepotNote || !entrepotNotePoolOf(c)) return c;
    const note = entrepotNoteOf(c, record, seed, factsOnce);
    return note === c.entrepotNote ? c : { ...c, entrepotNote: note };
  })));
}

/**
 * @template T
 * @param {T} value
 * @returns {Readonly<T>}
 */
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const v of Object.values(value)) deepFreeze(v);
    Object.freeze(value);
  }
  return value;
}
