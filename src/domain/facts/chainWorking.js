/**
 * domain/facts/chainWorking.js — A CHAIN WORKS THIS RESOURCE HERE (COHERENCE-AGREE-7, REVIEW-AGREE-2 F4; the chair's
 * re-ruling of 2026-11-12: the leaf only, not the generator's gate).
 *
 * F4: an income line said a resource is worked here ("Local ore feeds the smithy", "Local quarry provides dressed
 * stone", "managed felling and sawmilling") where the roster and the Resources tab said no one works it. "Does the
 * town hold the resource?" is the resource fact; "is the resource WORKED here?" is a second fact, and the chain model
 * already answers it in each chain's own state. This leaf is that answer's one home:
 *
 *   a chain works resource K here  ⇔  some chain of the record's `economicState.activeChains`
 *     · takes K as its input (`resourceInputKey`),
 *     · has its input (`resourceInputAvailable === true`: the town's own, live; measured over the lane's 4,141
 *       births, the flag and the record's live roster agree on every one of 28,298 chains that name an input), and
 *     · is working (`status` one of WORKING_CHAIN_STATUSES: running, operational, entrepôt, vulnerable, magically
 *       sustained; an impaired chain's input is spent, and an unexploited one has no one at it).
 *
 * The income source itself is unchanged (the chair: "the income source stays as it is"). The lines that read this
 * leaf are the second wave's (lane/w2-a-leaves-2026-11-12, lane/w2-b-declare-2026-11-12).
 *
 * P1-a (W2-C-LEAVES-3): a house of `WORKED_BY_HOUSE` (an apothecary on the medicinal herbs) works its good too.
 *
 * Layer 2 (the economy over the base). Pure: no randomness, no clock, no write; it reads the record and nothing else.
 */
import { availableNativeResourceKeys } from '../resourceSemantics.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { RESOURCE_DATA } from '../../data/goods/identity.js';

/** The chain states in which a chain is working its input (computeActiveChains.js :: the status ladder). */
export const WORKING_CHAIN_STATUSES = Object.freeze(['running', 'operational', 'entrepot', 'vulnerable', 'magically_sustained']);

/**
 * A CHAIN WORKS A RESOURCE ONLY THROUGH A HOUSE WHOSE TRADE IS TO EXTRACT OR PROCESS IT (W2-C-LEAVES R3, the chair's
 * ruling on REVIEW-R2-STAGES finding 4, 2026-11-13). The chain data names an input for chains whose houses only USE
 * it, so the leaf read them as working it and true "No one here works the …" lines were lost. ONE closed list, each
 * entry with its cause; a chain is left out for an entry's resource (or good) when its id is the entry's, or when
 * EVERY house it runs through is of the entry's houses. Households that forage DO work what they gather: no entry.
 * The deeper home is the chain data's own rows (`data/supplyChainData.js`: `fortification` and the clergy chains
 * name an input they do not work), named in the lane's hand-back; this list is the leaf's reading of them.
 * @type {ReadonlyArray<Readonly<{ chains?: ReadonlyArray<string>, houses?: ReadonlyArray<string>, resources?: ReadonlyArray<string>, goods?: ReadonlyArray<string>, cause: string }>>}
 */
export const NOT_WORKED_THROUGH = Object.freeze([
  Object.freeze({ chains: ['fortification'], resources: ['stone_quarry'],
    cause: 'a palisade, walls, gates or a citadel use dressed stone; they do not quarry or dress it (r2r-village-56, r2s-succession_void-hamlet-1)' }),
  Object.freeze({ houses: ['brickmaker'], resources: ['stone_quarry'],
    cause: 'a brickmaker fires clay; it does not quarry stone (the Stone & Construction chain held by a Brickmaker alone)' }),
  Object.freeze({ chains: ['divine_healing', 'pilgrimage'], goods: ['medicinal herbs'],
    cause: 'clergy at the hot springs heal and receive pilgrims; they do not gather the herbs (r2r-village-38, r2r-town-43)' }),
]);

/**
 * A HOUSE WHOSE TRADE WORKS A GOOD THAT NO CHAIN OF THE MODEL TAKES THROUGH IT (W2-C-LEAVES-3, the chair's ruling P1-a,
 * 2026-11-13): the counterpart of `NOT_WORKED_THROUGH`. ONE closed list, each entry with its cause: where the asked good
 * is an entry's, a resource of the town's own (live) yields it, a house of the entry's trade stands on the live roster
 * (not a road to elsewhere), and no import of the record brings the good in (`brought`: then the house works what is
 * bought, and the town's own source is not what reaches it), the good is worked here.
 * @type {ReadonlyArray<Readonly<{ houses: ReadonlyArray<string>, goods: ReadonlyArray<string>, brought: RegExp, cause: string }>>}
 */
export const WORKED_BY_HOUSE = Object.freeze([
  Object.freeze({ houses: ['apothecar'], goods: ['medicinal herbs'], brought: /\bherbs?\b/i,
    cause: "an apothecary's house works the medicinal herbs of the town's own ground into its remedies; the chain model takes the herbs only from foraging areas (P1-a: r2r-village-47, r2r-metropolis-31, r2r-metropolis-54). Where the record imports herbs (\"Medicinal herbs\", \"Herbs and forage (local gathering areas exhausted)\": r2r-town-17, r2r-city-41, the cold list's #1146) the apothecary's herbs are bought" }),
]);

/**
 * The entries of `WORKED_BY_HOUSE` for a good whose house stands on the live roster (whatever reaches it).
 * @param {unknown} record @param {string | undefined} good
 * @returns {ReadonlyArray<(typeof WORKED_BY_HOUSE)[number]>}
 */
function housesOfTradeFor(record, good) {
  if (good === undefined || !record || typeof record !== 'object') return [];
  const g = good.toLowerCase();
  const houses = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record))
    .map((i) => String(/** @type {{ name?: unknown }} */ (i)?.name ?? '').toLowerCase()).filter((n) => n && !n.startsWith('access to'));
  return WORKED_BY_HOUSE.filter((e) => e.goods.includes(g) && houses.some((n) => e.houses.some((w) => n.includes(w))));
}

/**
 * Whether a house of `WORKED_BY_HOUSE` works the asked good from one of these resources here.
 * @param {unknown} record @param {ReadonlySet<string>} keys @param {string | undefined} good
 * @returns {boolean}
 */
function houseWorksGood(record, keys, good) {
  const entries = housesOfTradeFor(record, good);
  if (!entries.length || good === undefined) return false;
  const g = good.toLowerCase();
  const r = /** @type {{ config?: Parameters<typeof availableNativeResourceKeys>[0], economicState?: { primaryImports?: unknown } }} */ (record);
  const own = availableNativeResourceKeys(r.config || {}).filter((k) => keys.has(k)
    && (/** @type {Readonly<Record<string, { commodities?: ReadonlyArray<string> } | undefined>>} */ (RESOURCE_DATA)[k]?.commodities || [])
      .some((c) => String(c).toLowerCase().replace(/_/g, ' ') === g));
  if (!own.length) return false;
  const imports = (Array.isArray(r.economicState?.primaryImports) ? r.economicState.primaryImports : []).map(String);
  return entries.some((e) => !imports.some((x) => e.brought.test(x)));
}

/**
 * Whether the closed list leaves this chain out for its input (and, where asked, for one good of it).
 * @param {{ chainId?: unknown, resourceInputKey?: unknown, processingInstitutions?: unknown }} chain
 * @param {string | undefined} good the good asked about ("medicinal herbs"), when the caller asks of one
 * @returns {boolean}
 */
function notWorkedThrough(chain, good) {
  const houses = (Array.isArray(chain.processingInstitutions) ? chain.processingInstitutions : []).map((h) => String(h).toLowerCase());
  return NOT_WORKED_THROUGH.some((e) => {
    const onInput = (e.resources && e.resources.includes(String(chain.resourceInputKey)))
      || (good !== undefined && e.goods !== undefined && e.goods.includes(good.toLowerCase()));
    if (!onInput) return false;
    if (e.chains && e.chains.includes(String(chain.chainId))) return true;
    return !!e.houses && houses.length > 0 && houses.every((h) => (e.houses || []).some((w) => h.includes(w)));
  });
}

/**
 * The record's chains that work any of these resources here.
 * @param {unknown} record the settlement record (its `economicState.activeChains`)
 * @param {string | ReadonlyArray<string>} resourceKeys one catalogue resource key, or several (a family: any of them)
 * @param {string} [good] the good asked about, where the caller asks of one (R3: the clergy at the springs do not work
 *   the herbs the springs also yield)
 * @returns {ReadonlyArray<object>} the working chains, in the record's order (empty where none works them)
 */
export function chainsWorking(record, resourceKeys, good) {
  const keys = new Set((Array.isArray(resourceKeys) ? resourceKeys : [resourceKeys]).map(String));
  const economicState = record && typeof record === 'object'
    ? /** @type {{ economicState?: { activeChains?: unknown } }} */ (record).economicState
    : null;
  const chains = Array.isArray(economicState?.activeChains) ? economicState.activeChains : [];
  return Object.freeze(chains.filter((chain) => {
    const c = chain && typeof chain === 'object'
      ? /** @type {{ resourceInputKey?: unknown, resourceInputAvailable?: unknown, status?: unknown, chainId?: unknown, processingInstitutions?: unknown }} */ (chain)
      : null;
    return c !== null
      && typeof c.resourceInputKey === 'string' && keys.has(c.resourceInputKey)
      && c.resourceInputAvailable === true
      && WORKING_CHAIN_STATUSES.includes(String(c.status))
      && !notWorkedThrough(c, good);
  }));
}

/**
 * THE ONE ANSWER to "does a chain work this resource here?".
 * @param {unknown} record the settlement record
 * @param {string | ReadonlyArray<string>} resourceKeys one catalogue resource key, or a family of them (any)
 * @param {string} [good] the good asked about, where the caller asks of one (`NOT_WORKED_THROUGH`)
 * @returns {boolean}
 */
export function chainWorksResource(record, resourceKeys, good) {
  return chainsWorking(record, resourceKeys, good).length > 0
    || houseWorksGood(record, new Set((Array.isArray(resourceKeys) ? resourceKeys : [resourceKeys]).map(String)), good);
}

/**
 * WHETHER THE CHAIN MODEL SPEAKS OF THIS RESOURCE AT ALL (W2-C-LEAVES, 2026-11-13): some chain of the record takes it
 * as its input, in any state. Where none does, the leaf's "no" is the model's silence and not a reading: measured
 * at the merged base on the census's 720, every half-way gap line the leaf would answer "no" (9) sits on a resource
 * no chain of the record takes (fish in a thorp, a hot spring, gemstones), beside the house that works it part-way.
 * @param {unknown} record the settlement record
 * @param {string | ReadonlyArray<string>} resourceKeys one catalogue resource key, or a family of them (any)
 * @returns {boolean}
 */
export function chainModelsResource(record, resourceKeys) {
  const keys = new Set((Array.isArray(resourceKeys) ? resourceKeys : [resourceKeys]).map(String));
  const economicState = record && typeof record === 'object'
    ? /** @type {{ economicState?: { activeChains?: unknown } }} */ (record).economicState
    : null;
  const chains = Array.isArray(economicState?.activeChains) ? economicState.activeChains : [];
  return chains.some((chain) => {
    const key = chain && typeof chain === 'object' ? /** @type {{ resourceInputKey?: unknown }} */ (chain).resourceInputKey : null;
    return typeof key === 'string' && keys.has(key);
  });
}
