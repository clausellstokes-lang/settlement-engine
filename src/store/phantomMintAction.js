/**
 * phantomMintAction.js — THE STORE'S HALF OF THE PHANTOM DOOR (EM-F3, wave 5; design
 * §2.8 and §13, the chair's judgments 261 and 275).
 *
 * TWO EXPORTS, ONE SUBJECT: the off-stage counterparty as the store sees it. `mintPhantomIntent`
 * is the WRITER the edit shell's plus is bound to — it mints EM-F1's record through EM-F1's own
 * leaf and writes it as ONE save through the estate's REAL save path; `counterpartiesOf` is the
 * pure READ the shell's fourth roster renders, and it is the only place the question "is this
 * partner off-stage" is asked on the editor's surface.
 *
 * ⛔ WHY THIS LEAF EXISTS AT ALL, RATHER THAN THE SHELL DOING IT. The shell's own landed arm
 * (`tests/components/editModeShell.test.jsx` A7) asserts its `src/domain/edit/*` edge set is
 * EXACTLY `['fieldDeclarations']`, so the shell may not import the phantom leaf, the pool table
 * or the DM layer. The estate's answer to that everywhere else is EM-D1's own idiom: the shell
 * binds a store function and passes it down (`applyPlainEditIntent`). This is that function, and
 * the door stays a container that knows no producer.
 *
 * ⛔ IT IS LAZY, AND THAT IS MEASURED RATHER THAN CHOSEN. Its only importer under `src/` is
 * `src/components/edit/EditModeShell.jsx`, which `src/App.jsx` reaches through one
 * `lazy(() => import(...))` edge, so nothing here enters the first-paint closure —
 * `EAGER_FIRST_PAINT_MODULES` is unmoved. That is also what makes the edge to the EAGER
 * `src/lib/saves.js` free: this leaf hangs off the save service, never the other way round.
 *
 * ⚠ AND IT AGES A LANDED ROSTER, DECLARED RATHER THAN QUIETLY ABSORBED:
 * `tests/domain/phantoms.test.js` A12 pins EM-F1's leaf's importers EXACT. This is the THIRD,
 * and the row that arm is owed is
 * 'src/store/phantomMintAction.js imports src/domain/edit/phantoms.js'.
 *
 * ⭐ THE MINT'S TWO PRODUCERS ARE INJECTED, AND BOTH ARE THE ESTATE'S OWN. EM-F1 takes
 * `mintId` and `roll` as a tool bag precisely so its leaf can import nothing at run time; this
 * leaf binds `mintDmId` (the one DM identity namespace) and `rollFrom` (the pool table's own
 * roller). Neither is re-implemented here and neither is stubbed.
 *
 * ⭐ THE DM'S DECLARED PICK RIDES THE ROLLER, NEVER A SECOND WRITE OF THE RECORD. EM-A1 declares
 * the phantom card's `size` against the `tier` pool — which is EXACTLY the pool EM-F1's
 * `PHANTOM_TRAIT_POOLS.size` rolls from. So the DM's choice is honoured by ANSWERING that roll
 * with her word instead of a draw: the record `mintPhantom` returns is still the frozen five-key
 * record it has always been, no key is added, no key is rewritten, and the persisted shape is
 * untouched. A trait the DM left blank takes the seed's own roll, and a value that is not a
 * member of its pool is REFUSED rather than smuggled onto the record.
 *
 * ⛔ THE SEED IS THE PHANTOM'S OWN, NOT THE TOWN'S. `mintPhantom(seed, …)` copies its `seed`
 * argument onto the record, and EM-F2 forges THAT seed when the phantom is promoted. Handing it
 * the open settlement's seed would give every phantom of one town the same forged world, so the
 * seed is minted from the town's seed and the mint index through the estate's own deterministic
 * id minter: same town, same index, same phantom, forever.
 *
 * ⛔ THE NETWORK IS READ THROUGH THE ESTATE'S OWN CHOKEPOINT, AND THAT IS A MEASUREMENT
 * RATHER THAN A PREFERENCE. `effectiveNeighboursOf(save, [])` is the single place the
 * neighbour network is read for a display surface, and with NO co-campaign saves it returns the
 * explicit array BY IDENTITY — so this roster mints no implicit neutral and behaves exactly as
 * a raw read would. Reading `settlement.neighbourNetwork` here instead would put a NEW ADDRESS
 * on the banked observed-shape identity `neighbourNetwork on settlement` in a file whose ceiling
 * is zero, and that register is the chair's to regenerate, never a lane's.
 *
 * ⛔ NOTHING HERE WRITES A WORLD FACT, AND THAT IS DESIGN §13 MADE STRUCTURAL. The mint writes
 * exactly one save row and re-reads the library. It writes no relationship state, no neighbour
 * link, no treaty, no route and no envoy state — not onto the phantom, and not onto the open
 * settlement, whose record this leaf never touches. The stance design §2.8 mentions belongs to
 * the neighbour link the SAVE PATH derives when a town names its neighbour, which is a different
 * act by a different hand.
 */

import { mintDmId } from '../domain/edit/dmLayer.js';
import {
  PHANTOM_KIND, PHANTOM_TRAIT_POOLS, isPhantomSave, mintPhantom,
} from '../domain/edit/phantoms.js';
import { poolValues, rollFrom } from '../domain/edit/pools.js';
import { effectiveNeighboursOf } from '../domain/relationships/effectiveNeighbours.js';
import { saves as savesService } from '../lib/saves.js';
import {
  captureSavedSettlementsHydration, commitSavedSettlementsHydration,
} from './savedSettlementsHydration.js';

/**
 * THE CLOSED REFUSAL SET, frozen, in codepoint order. Every one of them is a state the door
 * can open on and say a true sentence about; there is no catch-all and no thrown error.
 * @type {readonly string[]}
 */
export const MINT_REFUSALS = Object.freeze([
  'invalid_name', 'mint_failed', 'no_seed', 'off_pool', 'save_failed',
]);

/**
 * The five, named, so no reader has to count array positions. Read OFF the frozen list rather
 * than spelled twice, so a reordering cannot make a refusal answer a different word than the
 * closed set declares.
 */
const [INVALID_NAME, MINT_FAILED, NO_SEED, OFF_POOL, SAVE_FAILED] = MINT_REFUSALS;

/** One counterparty row the shell renders. @typedef {{ id: string, name: string, offStage: boolean }} Counterparty */

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * THE MINT'S TRAIT POOLS, INVERTED ONCE. EM-F1 keys its table trait -> pool id and calls the
 * roller with the POOL ID, so the binder below can only recognise the DM's pick by inverting it.
 * Derived from the producer, never re-typed, so a renamed pool moves this reader with it.
 * @type {Readonly<Record<string, string>>}
 */
const TRAIT_BY_POOL = Object.freeze(Object.fromEntries(
  Object.keys(PHANTOM_TRAIT_POOLS).map((trait) => [PHANTOM_TRAIT_POOLS[trait], trait]),
));

/**
 * ⭐ THE OFF-STAGE ROSTER THE SHELL RENDERS — the open settlement's own neighbour partners plus
 * every phantom the library holds, de-duplicated by name so a phantom the town already names
 * appears ONCE and wears the off-stage mark.
 *
 * The network's rows come first, in the record's own order, because that is the order the tome
 * shows them in; a minted phantom the town does not name yet follows, in the shelf's order. No
 * sort is applied and no name is invented: a row with no name is not a counterparty.
 *
 * @param {any} settlement the open settlement, as the store holds it
 * @param {unknown} saveRows the library rows, as the store holds them
 * @returns {readonly Counterparty[]} frozen; never null, never a throw
 */
export function counterpartiesOf(settlement, saveRows) {
  const rows = Array.isArray(saveRows) ? saveRows : [];
  /** @type {Counterparty[]} */
  const out = [];
  const seen = new Set();
  /** @type {Map<string, Record<string, unknown>>} */
  const phantomsByName = new Map();
  for (const row of rows) {
    if (!isPhantomSave(row)) continue;
    const blob = isPlainObject(row) ? row.settlement : null;
    const name = isPlainObject(blob) && typeof blob.name === 'string' ? blob.name : '';
    if (name !== '' && !phantomsByName.has(name)) phantomsByName.set(name, /** @type {Record<string, unknown>} */ (row));
  }

  const network = effectiveNeighboursOf({ settlement }, []);
  for (const entry of Array.isArray(network) ? network : []) {
    const name = isPlainObject(entry) && typeof entry.name === 'string' ? entry.name : '';
    if (name === '' || seen.has(name)) continue;
    seen.add(name);
    const phantom = phantomsByName.get(name);
    out.push(Object.freeze({
      id: String(phantom ? phantom.id : (isPlainObject(entry) && entry.id != null ? entry.id : name)),
      name,
      offStage: phantom !== undefined,
    }));
  }

  for (const [name, row] of phantomsByName) {
    if (seen.has(name)) continue;
    seen.add(name);
    out.push(Object.freeze({ id: String(row.id), name, offStage: true }));
  }
  return Object.freeze(out);
}

/**
 * ⭐ THE MINT, AS THE SHELL'S PLUS BINDS IT. The four coordinates a CREATE door can honestly
 * know are the declared fields' values; everything else — the seed, the mint index, the two
 * producers, the envelope — is the store's, and is read here.
 *
 * @param {() => any} get the store's state reader, passed by the binder
 * @param {(recipe: (draft: any) => void) => void} set the store's writer, passed by the binder
 * @param {unknown} intent the door's values, keyed by the phantom card's declared field names
 * @returns {Promise<{ ok: true, id: string } | { ok: false, reason: string }>} never throws
 */
export async function mintPhantomIntent(get, set, intent) {
  const state = typeof get === 'function' ? get() : null;
  const values = isPlainObject(intent) ? intent : {};

  const seedRoot = typeof state?.lastSeed === 'string' ? state.lastSeed : '';
  if (seedRoot === '') return { ok: /** @type {false} */ (false), reason: NO_SEED };

  const name = typeof values.name === 'string' ? values.name.trim() : '';
  if (name === '') return { ok: /** @type {false} */ (false), reason: INVALID_NAME };

  const rows = Array.isArray(state?.savedSettlements) ? state.savedSettlements : [];
  // THE MINT INDEX IS THE PHANTOM COUNT, so the same town mints the same phantom for the same
  // index forever and two phantoms of one town never share an id, a seed or a forged world.
  let n = 0;
  for (const row of rows) if (isPhantomSave(row)) n += 1;

  // ⛔ THE DM'S PICKS, VALIDATED BEFORE ANYTHING IS MINTED. A blank is "roll it"; a member of
  // the pool is the DM's word; anything else is refused, because a stray value on a persisted
  // record is the class this estate keeps curing.
  /** @type {Record<string, string>} */
  const chosen = {};
  for (const trait of Object.keys(PHANTOM_TRAIT_POOLS)) {
    const picked = typeof values[trait] === 'string' ? String(values[trait]).trim() : '';
    if (picked === '') continue;
    if (!poolValues(PHANTOM_TRAIT_POOLS[trait], null).includes(picked)) {
      return { ok: /** @type {false} */ (false), reason: OFF_POOL };
    }
    chosen[trait] = picked;
  }

  const seed = mintDmId(seedRoot, PHANTOM_KIND, n);
  /**
   * THE ROLLER, BOUND. It answers the DM's word for a trait she declared and defers to the pool
   * table's own roll for every other, so the record's shape is the mint's and its values are
   * hers where she said one.
   * @param {string} poolId @param {any} world @param {string} rollSeed @param {string} entryId
   * @param {number} index
   */
  const roll = (poolId, world, rollSeed, entryId, index) => {
    const trait = TRAIT_BY_POOL[poolId];
    if (trait !== undefined && Object.hasOwn(chosen, trait)) return chosen[trait];
    return rollFrom(poolId, world, rollSeed, entryId, index);
  };

  const record = /** @type {Record<string, any>|null} */ (
    mintPhantom(seed, name, n, { mintId: mintDmId, roll }));
  if (record === null) return { ok: /** @type {false} */ (false), reason: MINT_FAILED };

  // THE ENVELOPE IS THE COLUMNS THE TABLE ALREADY HAS, AND NO MORE (judgment 261). The row id
  // is the record's own minted id, which is what makes the Forge control's `promote` argument
  // the phantom's own identity rather than a second key somebody has to keep in step.
  const envelope = {
    id: String(record.id),
    name: String(record.name),
    tier: String(record.traits.size),
    settlement: record,
    seed: String(record.seed),
    config: null,
    aiData: {},
    versionHistory: [],
  };

  const hydration = captureSavedSettlementsHydration(state, state?.savedSettlementsOwnerId ?? null);
  try {
    await savesService.save(envelope);
    commitSavedSettlementsHydration(set, await savesService.list(), hydration);
  } catch {
    // A failed write is a state the door opens on and says a true sentence about; it is never
    // a thrown error at a component, and the library cache is left exactly as it was.
    return { ok: /** @type {false} */ (false), reason: SAVE_FAILED };
  }
  return { ok: /** @type {true} */ (true), id: String(record.id) };
}
