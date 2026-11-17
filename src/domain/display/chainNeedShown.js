/**
 * domain/display/chainNeedShown.js — WHAT A CHAIN CARD SAYS A NEED DOES (W2-C-LEAVES-6 item 6, 2026-11-14; the round-three
 * cut's #920, #1044, #1047, #1049: "Needs Iron + fuel · affects: law enforcement, patrol, investigation", a chip row of
 * the model's own need label and service keys; the first leaves lane's #1152: the bowyer's card carrying the craft
 * guilds' need for fine jewellery).
 *
 * RULED (the chair, 2026-11-13): ONE plain sentence of consequence, naming only services the town's own roster holds;
 * nothing printed where nothing the town has depends on the need; and (23:40 UTC) a card states a need only where it is
 * the need of a house WHOSE TRADE IS THAT CHAIN'S (`tradeListDisplay.js :: houseDoesChainsWork`, the goods pills' reading
 * of a chain's houses). The record is not touched (`chain.dependency`, written by `computeActiveChains.js` from
 * `economicState.tradeDependencies`); this leaf reads it:
 *   · the house: the dependency's own house, standing on the live roster (`facts/institutions.js ::
 *     liveInstitutionNames`), never a road to a neighbour's (`ACCESS_ONLY`), and one that does this chain's work;
 *   · the services: that house's own (`dependency.affectedServices`, its row of `data/economicData.js ::
 *     TRADE_DEPENDENCY_NEEDS`), the first three, as the card printed them;
 *   · the goods: the parts of the need the record's imports bring (`importsAsPrinted(s).arriving`, matched as a need is,
 *     `needMetBy`); a part that is no good (trade access, capital, a harbour, water power, knowledge, a ley line) or that
 *     the record does not import is not said to come in; where no part is left, nothing is printed;
 *   · the consequence, by the town's state, said of the supply and never of how far the services fall (the record's
 *     "Operating at minimal capacity or shut down" is one word for every house, a cathedral's stone and a tavern's grain
 *     alike): under a siege in force (`chainStateShown.js :: tradeStoppedHere`, the siege's own note "The siege has cut
 *     every road in") the goods come from outside and the siege has cut them off (no present "brought in", W2-C-LEAVES-3
 *     #169); on an isolated route (`economicState.tradeAccess`) the record's own reading of the need decides: met by
 *     magic (its severity not critical: the generator's "teleportation imports replace road access") or run on stores
 *     ("running on existing stockpiles only"); else the goods are brought in, and a siege, a closed road or a blockade
 *     would cut them off (the record's "Siege, road closure, or blockade would impair operations").
 *
 * Pure: no randomness, no clock, no write.
 */
import { ACCESS_ONLY, liveInstitutionNames } from '../facts/institutions.js';
import { houseDoesChainsWork, importsAsPrinted, needMetBy } from './tradeListDisplay.js';
import { tradeStoppedHere } from './chainStateShown.js';
import { minorRoutesReach } from '../facts/tradeReach.js'; // BAR6-MARKS (CN1): the poor road an isolated place still has
import { filterDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { defenceKeepsService } from '../facts/defence.js';

/** The parts of a need label that are no good a cart or a ship brings in. */
const NOT_BROUGHT = /\btrade access\b|\bcapital\b|\bharbou?r\b|\bwater power\b|\bknowledge\b|\bley lines?\b/i;

/** @param {ReadonlyArray<string>} xs @param {string} last the last joining word @returns {string} */
const listed = (xs, last) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${last} ${xs[xs.length - 1]}`);

/**
 * The need's goods the record brings in, in plain words ("Iron + fuel" → ["iron"] where only iron is imported; "Wool /
 * flax" → ["wool or flax"]; "Timber/rags (paper)" → ["timber or rags for paper"]).
 * @param {string} need the dependency's need label @param {ReadonlyArray<string>} arriving the imports as printed
 * @returns {string[]}
 */
function goodsBroughtIn(need, arriving) {
  return need.split(/\s*\+\s*/).map((p) => p.trim()).filter((p) => p && !NOT_BROUGHT.test(p))
    .filter((p) => arriving.some((imp) => needMetBy(p, imp) || imp.toLowerCase().includes(p.toLowerCase().split(/[\s/]/)[0])))
    .map((p) => p.toLowerCase().replace(/\s*\/\s*/g, ' or ').replace(/\s*\(([^)]*)\)/g, ' for $1'));
}

/**
 * The card's one sentence of consequence for its need, or '' where it states none.
 * @param {unknown} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record
 * @param {boolean} [first] whether this is the first card of the page to state a need: the shared clause of the calm and
 *   the isolated forms prints there only (X-50, BOILERPLATE ONCE: the record gives every need of a town the same impact)
 * @returns {string}
 */
export function chainNeedLine(chain, record, first = true) {
  const c = /** @type {{ processingInstitutions?: unknown, dependency?: { institution?: unknown, resource?: unknown, severity?: unknown, affectedServices?: unknown } | null } | null} */ (
    chain && typeof chain === 'object' ? chain : null);
  const dep = c?.dependency;
  if (!dep || !record || typeof record !== 'object') return '';
  const house = String(dep.institution ?? '');
  if (!house || ACCESS_ONLY.test(house) || !liveInstitutionNames(/** @type {Parameters<typeof liveInstitutionNames>[0]} */ (record)).includes(house)) return '';
  if (!houseDoesChainsWork(c, house)) return '';
  // TAIL-DISPLAY-ECON-2 (12560, 12562): a service the town has no house for is not named: "gate control" only where a
  // gate stands; the watch's other work stays. TAIL-CLOSE-SRC-2: the home answers it (`facts/defence.js ::
  // defenceKeepsService`, over the one reader of the defence atoms), and its gate is the law: a palisade alone keeps none.
  const services = (Array.isArray(dep.affectedServices) ? dep.affectedServices : []).filter((x) => typeof x === 'string' && x.trim()).slice(0, 3).map(String)
    .filter((x) => defenceKeepsService(/** @type {Parameters<typeof defenceKeepsService>[0]} */ (record), x));
  if (services.length === 0) return '';
  const goods = goodsBroughtIn(String(dep.resource ?? ''), importsAsPrinted(/** @type {Parameters<typeof importsAsPrinted>[0]} */ (record)).arriving);
  if (goods.length === 0) return '';
  const svcs = listed(services, 'and'), Svcs = svcs.charAt(0).toUpperCase() + svcs.slice(1);
  const r = /** @type {{ name?: unknown, economicState?: { tradeAccess?: unknown } | null }} */ (record);
  const name = typeof r.name === 'string' && r.name ? r.name : 'the town';
  if (tradeStoppedHere(record)) {
    // W2-C-LEAVES-9 (the chair's ruling of 2026-11-14 05:28 (1)): the siege form names the siege, so it is DECLARED through
    // the list door: it prints only where the vocabulary's own reader holds a siege in force (the same home
    // `tradeStoppedHere` reads, `crisisOf`), byte-identical wherever it printed.
    const [siege] = filterDeclared([{ text: `${Svcs} here depend on ${listed(goods, 'and')} from outside, which the siege has cut off.`,
      needs: ['crisis: under_siege'] }], { facts: () => factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (record)), poolId: 'chainNeedShown:siege', surface: 'economics', drawKind: 'A' });
    return siege ? lineText(siege) : '';
  }
  if (r.economicState?.tradeAccess === 'isolated') {
    // BAR6-MARKS under RULING CN1 (the chair, 2026-11-16; vetoable by the owner; RECORD's 9d.isolated): an isolated village or
    // larger still has a poor road where no siege cuts it (`facts/tradeReach.js :: minorRoutesReach`, the food balance's own
    // minor-route rates): there the goods come in dear and late by the minor roads; "no trade road reaches" is kept for the
    // thorp, the hamlet and the siege
    const cfg = /** @type {{ config?: { tradeRouteAccess?: unknown } | null, tier?: unknown }} */ (record);
    if (minorRoutesReach({ route: cfg.config?.tradeRouteAccess, tier: cfg.tier, siege: tradeStoppedHere(record) })) {
      return dep.severity === 'critical'
        ? `${Svcs} here depend on ${listed(goods, 'and')} that come in dear and late by the minor roads.`
        : `${Svcs} here depend on ${listed(goods, 'and')} brought in by magic, or dear and late by the minor roads.`;
    }
    return dep.severity === 'critical'
      ? `${Svcs} here run on stored ${listed(goods, 'and')}${first ? `: no trade road reaches ${name}` : ''}.`
      : `${Svcs} here depend on ${listed(goods, 'and')} brought in by magic${first ? `: no trade road reaches ${name}` : ''}.`;
  }
  // BAR2-LABELS-2 (LB6, C26982): food "brought in" only where the food record brings food in (`foodSecurity.importPct`):
  // where it is 0, all the town eats is grown here and its grain or livestock is no need from outside.
  const calm = foodBroughtIn(record) ? goods : goods.filter((g) => !FOOD_GOOD.test(g));
  if (calm.length === 0) return '';
  return `${Svcs} here depend on ${listed(calm, 'and')} brought in${first ? ', which a siege, a closed road or a blockade would cut off' : ''}.`;
}

/** The need's goods that are food (the census's 720: "grain", "livestock or game"). */
const FOOD_GOOD = /^(?:grain|livestock|game|fish|flour|meat)\b/;

/**
 * Does the food record bring food in (BAR2-LABELS-2 LB6): `economicState.foodSecurity.importPct` above 0, or not stated.
 * @param {unknown} record @returns {boolean}
 */
function foodBroughtIn(record) {
  const pct = /** @type {{ economicState?: { foodSecurity?: { importPct?: unknown } | null } | null }} */ (record).economicState?.foodSecurity?.importPct;
  return typeof pct !== 'number' || pct > 0;
}
