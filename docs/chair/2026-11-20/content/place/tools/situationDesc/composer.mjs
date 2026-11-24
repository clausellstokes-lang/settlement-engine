// PLACE-1 · situationDesc MEASURE: THE CANDIDATE COMPOSER, simulated in scratch (never in src/). It stands where the
// medium branch of `prosperity.js :: situationDescOf` returns "Trade proceeds at an ordinary pace for a settlement of this
// size." and composes, from the record's own lists and route, one plain medium-band remark. The shape is the house's:
// declared rows `{ id, text, needs }` (a `text` function the caller applies: `drawDeclared.js :: lineText`), drawn through
// `drawDeclared` with the site's selector `pickVariant(pool, '<seed>::situationDesc')` (`kernel/proseHash.js`: no roll),
// a refused draw resolved by the house's twin/argmax rule, a seedless caller given the canonical line.

export const CANONICAL = 'Trade proceeds at an ordinary pace for a settlement of this size.';

/** A good's name as a sentence carries it: the trade mark and any parenthetical note off, the lead lower-cased. */
export const goodWord = (raw, tradeMarkOf) => {
  const label = String(tradeMarkOf(String(raw)).label || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  return label ? label[0].toLowerCase() + label.slice(1) : '';
};

const ROUTE_WORDS = Object.freeze({ road: 'by road', river: 'by river', port: 'by sea', crossroads: 'along the roads that meet here', mountain_pass: 'over the pass' });
const routeRow = (route) => ({
  id: `route-${route}`, needs: Object.freeze(['exports', `route: ${route}`]),
  text: (g) => `It sends its ${g.ex1} out ${ROUTE_WORDS[route]}, and trade keeps an ordinary pace for a place this size.`,
});
const routeOnlyRow = (route) => ({
  id: `route-only-${route}`, needs: Object.freeze([`route: ${route}`]), excludes: Object.freeze(['exports']),
  text: () => `What little trade there is comes and goes ${ROUTE_WORDS[route]}, at an ordinary pace for a place this size.`,
});
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const both = (g) => (g.ex2 ? `${g.ex1} and ${g.ex2}` : g.ex1);

/** THE POOL (the candidate data file's table). Each wording declares every fact it names; none names a trouble. */
export const ORDINARY_TRADE_LINES = Object.freeze([
  { id: 'sells-buys', needs: ['exports', 'imports'], text: (g) => `It sells ${g.ex1} and buys ${g.im1}, and its trade goes on at an ordinary pace.` },
  { id: 'steady-sends', needs: ['exports'], text: (g) => `Its trade is steady rather than busy, and it sends out mostly ${both(g)}.` },
  { id: 'out-in', needs: ['exports', 'imports'], text: (g) => `It sends out ${g.ex1} and brings in ${g.im1}, at the pace usual for a place this size.` },
  { id: 'buys-in', needs: ['imports'], text: (g) => `Trade here is ordinary; the main thing it has to buy in is ${g.im1}.` },
  { id: 'market-sends', needs: ['market', 'exports'], text: (g) => `The market does ordinary business, and the main thing sold on beyond it is ${g.ex1}.` },
  ...Object.keys(ROUTE_WORDS).map(routeRow),
  ...Object.keys(ROUTE_WORDS).map(routeOnlyRow),
].map((r) => Object.freeze(r)));

/**
 * @param {any} row a measure.mjs row (the final record's facts and lists)
 * @param {{ drawDeclared: Function, pickVariant: Function, tradeMarkOf: Function }} deps the house's own functions, imported from src/
 * @returns {string}
 */
export function composeOrdinaryTradeLine(row, { drawDeclared, pickVariant, tradeMarkOf }) {
  const seed = row.seed;
  // the goods as the page prints them (tradeListsAsPrinted), so the line never names a good the Economics tab hides
  const ex = row.printed.exports.map((x) => goodWord(x, tradeMarkOf)).filter(Boolean);
  const im = row.printed.imports.map((x) => goodWord(x, tradeMarkOf)).filter(Boolean).filter((x) => !ex.includes(x));
  const g = { ex1: ex[0], ex2: ex[1], im1: im[0] };
  // the facts the rows declare: the record's own (factsOf's `exports`, `imports`, `market`, `route`), narrowed where the
  // page prints nothing (a slot with no word to fill reads as absent)
  const facts = { exports: ex.length ? row.exports : [], imports: im.length ? row.imports : [], market: row.facts.market, route: row.facts.route };
  if (!seed) { row.__wording = 'canonical'; return CANONICAL; }
  const key = `${seed}::situationDesc`;
  const r = drawDeclared(ORDINARY_TRADE_LINES, { facts, draw: (p) => pickVariant(p, key), key, poolId: 'situationDesc:ORDINARY_TRADE_LINES', surface: 'economics', drawKind: 'H' });
  row.__wording = r.line ? `${r.line.id}:${r.resolvedBy}` : 'canonical:none';
  return r.line ? r.line.text(g) : CANONICAL;
}
