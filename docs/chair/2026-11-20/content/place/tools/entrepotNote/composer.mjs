// PLACE-1 · entrepotNote MEASURE: THE CANDIDATE COMPOSER, simulated in scratch (never in src/).
// One pool a chain id (the candidate data file's table, keyed as `supplyChainData.js` keys its chains). Row 0 of every
// pool is the chain's canonical note, read from the chain record (CANONICAL-AT-ZERO: a falsy seed keeps it). Rows are
// declared `{ id, text, needs }` (the house shape: `drawDeclared.js`); a row that names a route declares `route: <kind>`,
// a row that says the chain's ground is (or is not) the town's own declares the PROPOSED chain-scoped atom
// `carrier: own|transit` (G: its home `facts/chainCarrier.js :: chainCarrierOf`). No row names a trouble, a season, a
// count or a person the record lacks. The subject (salt, furs, wine…) is the chain's own, as the canonical note names it.

export const ROUTE_KINDS = Object.freeze(['port', 'river', 'crossroads', 'road']);
const r = (id, needs, text) => Object.freeze({ id, needs: Object.freeze(needs), text });
/** Four rows, one a route kind, from a phrase table. @param {string} p @param {Record<string,string>} t */
const routeRows = (p, t) => ROUTE_KINDS.filter((k) => t[k]).map((k) => r(`${p}-${k}`, [`route: ${k}`], t[k]));

export const ENTREPOT_NOTES = Object.freeze({
  salt: Object.freeze([
    ...routeRows('salt', {
      port: 'Salt comes in by sea and goes on inland from here, and the place keeps a share of every load.',
      river: 'Salt moves up and down the river, and some of every load is sold off here.',
      crossroads: 'Salt comes in on one road and leaves on another, and the place takes its cut between.',
      road: 'Salt comes in by road and is sold on from here to the places further along.',
    }),
    r('salt-own', ['carrier: own'], 'Much of the salt sold here is its own, taken from the salt flats nearby.'),
    r('salt-own-keep', ['carrier: own'], 'The salt flats nearby supply the salt, and most of it goes into preserving food.'),
    r('salt-transit', ['carrier: transit'], 'No salt is taken here; it is brought in, and sold on or used to preserve food.'),
    r('salt-wanted', [], 'Salt is wanted everywhere, and a share of the trade in it passes through here.'),
    r('salt-bought', [], 'Salt is bought and sold here in quantity, for preserving food and for selling on.'),
  ]),
  furs_north: Object.freeze([
    ...routeRows('furs', {
      port: 'Furs are gathered here from inland and shipped on by sea.',
      river: 'Furs come down the river in bales and change hands here before going on.',
      crossroads: 'Furs from several directions meet here, where the roads cross, and are sold on.',
      road: 'Furs come in along the road and change hands here before going on.',
    }),
    r('furs-own', ['carrier: own'], 'Many of the furs sold here are taken on its own hunting grounds.'),
    r('furs-own-rest', ['carrier: own'], 'Furs and pelts come off the hunting grounds nearby, and what is not used here is traded on.'),
    r('furs-transit', ['carrier: transit'], 'None of these furs are taken here; they come from the hunting grounds and are traded on.'),
    r('furs-through', ['carrier: transit'], 'Furs pass through here on their way to buyers elsewhere, and the place takes a share of the trade.'),
    r('furs-steady', [], 'The fur trade is steady here, in pelts and the leather made from them.'),
    r('furs-regular', [], 'Furs and pelts are a regular part of the trade here.'),
  ]),
  luxury_goods: Object.freeze([
    ...routeRows('lux', {
      port: 'Fine goods arrive by sea, and are sold here and inland at a good markup.',
      river: 'Fine goods come up the river to be sold here, and the markup on them is high.',
      crossroads: 'Fine goods from several directions meet here where the roads cross, and are sold on at a markup.',
      road: 'Fine goods come in by road from far away, and are sold here at a good markup.',
    }),
    r('lux-own', ['carrier: own'], 'The precious metal of the veins nearby is worked here into jewellery and fine metalwork.'),
    r('lux-transit', ['carrier: transit'], 'Little of the luxury trade here starts here: fine goods are brought in and sold on at a markup.'),
    r('lux-value', [], 'Fine goods are a small trade by weight but a large one by value, and some of it passes through here.'),
    r('lux-far', [], 'Luxury goods are carried far, and part of what they earn on the way is earned here.'),
    r('lux-kinds', [], 'The luxury trade here is in fine metalwork, jewellery and other costly goods.'),
    r('lux-price', [], 'Costly goods travel long distances, and every place they pass through adds to the price.'),
    r('lux-market', ['market'], 'Costly goods, jewellery and fine metalwork among them, are sold in the market here.'),
  ]),
  spices_dyes: Object.freeze([
    ...routeRows('spice', {
      port: 'Spices and dyes come in by sea from distant lands, and are sold on inland from here.',
      river: 'Spices and dyes come up the river from distant lands, and are sold on from here at a markup.',
      crossroads: 'Spices and dyes from distant lands reach the crossing roads here and are sold on in every direction.',
      road: 'Spices and dyes come in along the road from far away and are sold on at a markup.',
    }),
    r('spice-far', [], 'Nothing in this trade is grown here: the spices and dyes come from far away and pass on at a profit.'),
    r('spice-light', [], 'Spices and dyes are light, costly and carried far, and part of their price is added here.'),
    r('spice-others', [], 'The spice and dye trade here is a trade in other places\' goods, bought in and sold on.'),
    r('spice-bulk', [], 'Spices and dyes are a small trade here by bulk, and a profitable one.'),
    r('spice-market', ['market'], 'Spices and dyes from far away are sold in the market here, and some are carried on.'),
  ]),
  silk_luxury_textiles: Object.freeze([
    ...routeRows('silk', {
      port: 'Silk arrives by sea, and from here it is carried inland to be sold.',
      river: 'Silk comes up the river to be sold here, or carried further on.',
      crossroads: 'Silk reaches the crossing roads here and is sent on inland in several directions.',
      road: 'Silk comes in by road from far away, and is sold here or carried on.',
    }),
    r('silk-none', [], 'No silk is made here; it is brought from far away, and fine cloth is sold on from here.'),
    r('silk-long', [], 'Silk is carried a long way to reach this place, and it is sold on at a good price.'),
    r('silk-trade', [], 'The silk trade here is a trade in fine cloth bought from far away and sold on.'),
    r('silk-market', ['market'], 'Silk and other fine cloth from far away are sold in the market here.'),
    r('silk-steady', [], 'Fine cloth from far away is a steady trade here, most of it silk.'),
    r('silk-bales', [], 'Bales of silk are bought here from those who have carried them far, and sold on.'),
  ]),
  wine_spirits: Object.freeze([
    ...routeRows('wine', {
      port: 'Wine comes in by sea in casks, and is sold here or carried on inland.',
      river: 'Wine comes down the river in casks, and is sold here and further on.',
      crossroads: 'Wine from more than one region meets here where the roads cross, and is sold on.',
      road: 'Wine comes in by road from far away, and is sold here and further on.',
    }),
    r('wine-cask', [], 'Wine is bought in by the cask here, and much of it is sold on.'),
    r('wine-through', [], 'The wine trade passes through here; casks are bought in, stored and sold on.'),
    r('wine-few', [], 'Wine is drunk everywhere and made in few places, and some of the trade between them runs through here.'),
    r('wine-tavern', ['institution: tavern'], 'Some of the wine coming through is drunk in the taverns here; the rest is sold on.'),
  ]),
  smuggling: Object.freeze([
    ...routeRows('smug', {
      port: 'Some cargo comes ashore here without being declared, and is sold on quietly.',
      river: 'Some goods come and go on the river without being declared, and are sold quietly here.',
      crossroads: 'Some goods pass through the crossing roads here undeclared and untaxed.',
      road: 'Some goods come in by road undeclared, and are sold on quietly.',
    }),
    r('smug-loads', [], 'Not every load that passes through here is declared, and some goods are sold where no tax is paid.'),
    r('smug-quiet', [], 'Alongside the honest trade runs a quieter one, in goods that pay no tax.'),
    r('smug-duty', [], 'Some of the trade here is smuggled: goods that pay no duty, moved by people who keep quiet about it.'),
  ]),
  magical_goods: Object.freeze([
    ...routeRows('magic', {
      port: 'Enchanted goods come in by sea and are sold here at a high price.',
      river: 'Enchanted goods come up the river and are sold here at a high price.',
      crossroads: 'Enchanted goods from several directions meet here where the roads cross, and fetch a high price.',
      road: 'Enchanted goods come in by road and are sold here at a high price.',
    }),
    r('magic-own', ['carrier: own'], 'Enchanted goods are made here near the ley line node, and sold on to buyers elsewhere.'),
    r('magic-transit', ['carrier: transit'], 'Most enchanted goods sold here are brought in from elsewhere, at a high price.'),
    r('magic-weight', [], 'Enchanted goods are worth a great deal for their weight, and some of that trade is done here.'),
    r('magic-small', [], 'The trade in enchanted goods is small but valuable, and buyers come here for it.'),
    r('magic-hands', [], 'Enchanted goods change hands here at high prices.'),
  ]),
  transit_finance: Object.freeze([
    ...routeRows('fin', {
      port: 'Merchants landing cargo here settle their accounts and borrow against it before moving on.',
      river: 'River traders settle their accounts here and borrow against their cargo.',
      crossroads: 'Traders meeting at the crossing roads here settle accounts and borrow against their loads.',
      road: 'Traders on the road settle their accounts here and borrow against their loads.',
    }),
    r('fin-bank', ['institution: bank'], 'The bank here lends to traders and changes their money, and earns from trade it does not carry.'),
    r('fin-lend', [], 'Lending and money-changing here earn from the trade that passes through.'),
    r('fin-credit', [], 'Large loads need credit, and the lending here grows with the trade passing through.'),
    r('fin-settle', [], 'Traders passing through borrow, settle and change money here, and that business pays.'),
  ]),
  warehouse_logistics: Object.freeze([
    ...routeRows('store', {
      port: 'Cargo landed from the sea is stored here and sent on, for a fee.',
      river: 'Cargo is unloaded from the river here, stored and sent on, and the place is paid for the handling.',
      crossroads: 'Loads coming in on one road are stored here and sent out on another, for a fee.',
      road: 'Loads are stored here and sent on along the road, for a fee.',
    }),
    r('store-others', [], 'Much of the work here is storing other people\'s goods and loading them for the next leg.'),
    r('store-handling', [], 'Goods are stored, loaded and sent on from here; the earnings are in the handling.'),
    r('store-little', [], 'The place makes little of what it handles; it is paid to store and move it.'),
  ]),
});

/** The facts a row's needs read, from a measure.mjs row and the chain. */
export function admits(needs, row, chain) {
  return needs.every((n) => {
    const [k, v] = n.split(':').map((x) => x.trim());
    if (k === 'route') return row.route === v;
    if (k === 'carrier') return chain.carrier === v;
    if (k === 'market') return row.facts.market === true;
    if (k === 'institution') return row.facts.inst?.[v] === true;
    throw new Error(`composer: an atom the simulation does not read: ${n}`);
  });
}

/**
 * The house's draw, simulated: `pickVariant(pool, key)` over the whole pool (no roll); a refused row resolves by the
 * argmax of `hashKey(key::lineId)` over the admitted rows (`drawDeclared.js`). Row 0 is the canonical note (no needs).
 * `drop`: atom keys whose rows leave the pool (the projection without the proposed `carrier` atom).
 * @param {{ fnv1a32: (s: string) => number, hashKey: (s: string) => number }} k
 */
export function compose(k, row, chain, drop = []) {
  const extra = ENTREPOT_NOTES[chain.id]?.filter((l) => !l.needs.some((n) => drop.includes(n.split(':')[0].trim())));
  if (!extra || !row.seed) return { text: chain.note, id: 'canonical', how: 'canonical' };
  const pool = [{ id: 'canonical', needs: [], text: chain.note }, ...extra];
  const key = `${row.seed}::entrepotNote::${chain.id}`;
  const drawn = pool[k.fnv1a32(key) % pool.length];
  if (admits(drawn.needs, row, chain)) return { text: drawn.text, id: drawn.id, how: 'drawn' };
  let best = null, bestK = -1;
  for (const l of pool) { if (!admits(l.needs, row, chain)) continue; const h = k.hashKey(`${key}::${l.id}`); if (h > bestK) { best = l; bestK = h; } }
  return { text: best.text, id: best.id, how: 'argmax' };
}
