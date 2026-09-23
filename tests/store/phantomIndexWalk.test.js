/**
 * phantomIndexWalk.test.js — EM-F3b's acceptance: A PHANTOM'S ID IS A CLAIM WALK, NEVER A
 * COUNT (the verifier's STOP-1 of the tests-only day; design §2.8 and §13).
 *
 * THE DEFECT THESE ARMS CONVICT. `mintPhantomIntent` took its mint index from the CURRENT
 * COUNT of phantom saves, and `mintDmId` is a pure hash of (seed, kind, n) — so index `n`
 * names one id forever while the count SHRINKS on two ordinary acts. EM-F2's promotion
 * replaces the phantom's blob in place with the forged settlement, which carries no `kind`,
 * so the row stops counting while keeping its id; a delete takes the row off the shelf. Either
 * way the next mint re-derived an id a LIVE row still holds, and `localSaveEntry` unshifts, so
 * the five-key stub landed FIRST and every `find` by id resolved to it while the forged town
 * became unreachable. THE PROMISE is that a seed is a starting world forever.
 *
 * THE CURE, IN TWO PLACES, AND BOTH ARE ASSERTED HERE: the index walks past every id ANY
 * library row claims — the estate's own `editSlice.js :: mintNewcomerId` idiom — and the local
 * create REFUSES a caller's id the device already holds, by a named code, before any write.
 *
 * EM-F3c ADDS TWO ARMS TO THIS FILE, both about the LOCAL half of a cure whose defect was the
 * cloud's (U83; `tests/store/phantomCloudId.test.js` carries that half). W6 pins that the local
 * backend is UNMOVED: it takes the mint's own key, so the door's receipt, the row and the record
 * are one string and the act owes no reconciling write. W7 pins the walk's SECOND coordinate
 * without leaving this substrate — a row that claims an index by its SEED under a key the mint
 * would never produce (the shape every cloud row has) is walked past just the same.
 *
 * Substrate: LOCAL mode (the supabase mock below), so the save service binds its real
 * localStorage path and every hop is EXECUTED rather than stubbed — EM-F3's own idiom, which
 * is what lets these arms read the DEVICE rather than a stub's memory of it.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — set equalities against `[]`,
 * counts against numbers, one boolean against `false` — so no `// anchored:` marker is owed
 * anywhere in this file.
 *
 * @enforced-by this test
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Force LOCAL mode: the save service binds localStorage, never a network client.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
}));

// Map-backed localStorage shim (EM-F1's own idiom) — node env, no jsdom. Installed at module
// scope; no imported module reads storage at import time.
{
  const data = new Map();
  globalThis.localStorage = {
    getItem: (k) => data.get(String(k)) ?? null,
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: (k) => { data.delete(String(k)); },
    clear: () => data.clear(),
  };
}

import { saves } from '../../src/lib/saves.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { PHANTOM_KIND, isPhantomSave } from '../../src/domain/edit/phantoms.js';
import { MINT_REFUSALS, mintPhantomIntent } from '../../src/store/phantomMintAction.js';

const TOWN_SEED = 'seed-ashford';

/** The open settlement the editor is on, and the row the library holds for it. */
const TOWN = Object.freeze({
  _seed: TOWN_SEED, id: 'set-ashford', name: 'Ashford', tier: 'town', npcs: [], factions: [],
});
const townEnvelope = () => ({
  id: 'row-ashford', name: 'Ashford', tier: 'town', seed: TOWN_SEED,
  settlement: { ...TOWN }, config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

/** The store as one session, and the two handles the binder is given. */
let storeState = {};
const get = () => storeState;
const set = (recipe) => { recipe(storeState); };

function seatStore(extra = {}) {
  storeState = {
    lastSeed: TOWN_SEED,
    settlement: TOWN,
    savedSettlements: [],
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: null,
    savedSettlementsHydrationGeneration: 0,
    ...extra,
  };
}

/** EM-F2's landed promotion, applied to the row: the blob is REPLACED IN PLACE, same id. */
const forge = (name) => ({
  _seed: `forged-${name}`, id: `set-${name}`, name, tier: 'village', npcs: [], factions: [],
});
async function promote(id, name) {
  await saves.update(String(id), { settlement: forge(name) });
  storeState.savedSettlements = await saves.list();
}

async function mint(name) {
  const answer = await mintPhantomIntent(get, set, { name });
  storeState.savedSettlements = await saves.list();
  return answer;
}

const idsOf = (rows) => rows.map((row) => String(row.id));

beforeEach(async () => {
  globalThis.localStorage.clear();
  seatStore();
  await saves.save(townEnvelope());
  storeState.savedSettlements = await saves.list();
});

describe('EM-F3b — the mint index walks past every claimed id', () => {
  test('W1: mint, PROMOTE, mint — the second counterparty takes a fresh id and the forged town survives', async () => {
    const first = await mint('Greymoor');
    expect(first.ok, 'the first counterparty was founded').toBe(true);

    // The promotion is EM-F2's own act: same primary key, a forged blob with no `kind`, so the
    // row stops reading as a phantom while it goes on claiming the id it was minted with.
    await promote(first.id, 'Greymoor');
    expect((await saves.list()).filter(isPhantomSave).length,
      'the library holds no phantom at all: the count the old index read has gone to zero').toBe(0);

    const second = await mint('Harrowfen');
    expect(second.ok, 'the second counterparty was founded').toBe(true);
    expect(String(second.id) === String(first.id),
      'the two mints share a primary key').toBe(false);

    // BOTH ROWS ARE STILL THERE AND BOTH ARE REACHABLE BY THEIR OWN ID — the half the id
    // compare alone would miss, because a shadowed row is present in the array and unreachable.
    const rows = await saves.list();
    expect(rows.length, 'the town, the forged world and the new counterparty').toBe(3);
    expect(new Set(idsOf(rows)).size, 'every library row carries a distinct primary key').toBe(rows.length);
    expect(rows.filter((row) => String(row.id) === String(first.id)).map((row) => row.settlement.name),
      'the promoted town is reached by its own id, and reached ONCE').toEqual(['Greymoor']);
    expect(rows.filter((row) => String(row.id) === String(second.id)).map((row) => row.settlement.name),
      'and the new counterparty by its own').toEqual(['Harrowfen']);
    expect(isPhantomSave(rows.find((row) => String(row.id) === String(first.id))),
      'the promoted row is a forged world, not a five-key stub wearing its key').toBe(false);
  });

  test('W2: mint, mint, DELETE the first, mint — the third takes a key no surviving row holds', async () => {
    const p0 = await mint('P0');
    const p1 = await mint('P1');
    await saves.delete(String(p0.id));
    storeState.savedSettlements = await saves.list();

    const p2 = await mint('P2');
    expect(p2.ok, 'the third counterparty was founded').toBe(true);
    expect(String(p2.id) === String(p1.id),
      'the third mint took the surviving counterparty\'s key').toBe(false);

    const rows = await saves.list();
    expect(new Set(idsOf(rows)).size, 'every library row carries a distinct primary key').toBe(rows.length);
    expect(rows.filter((row) => String(row.id) === String(p1.id)).map((row) => row.settlement.name),
      'and P1 is still reached by its own id').toEqual(['P1']);
  });

  test('W3: N mints and M promotions in ANY order — every id in the library stays unique', async () => {
    // Three orders over the same acts, run on a clean device each time. `P` mints, `F` promotes
    // the counterparty minted at that position — the two acts whose interleaving the count got
    // wrong — so the arm covers the promotion landing early, late, and between two mints.
    const orders = [
      ['P', 'P', 'F0', 'P', 'F1', 'P'],
      ['P', 'F0', 'P', 'P', 'P', 'F2'],
      ['P', 'P', 'P', 'F0', 'F1', 'F2'],
    ];
    for (const order of orders) {
      globalThis.localStorage.clear();
      seatStore();
      await saves.save(townEnvelope());
      storeState.savedSettlements = await saves.list();

      /** @type {string[]} */
      const minted = [];
      for (const step of order) {
        if (step === 'P') {
          const answer = await mint(`C${minted.length}`);
          expect(answer.ok, `every mint in the order ${order.join(' ')} answered ok`).toBe(true);
          minted.push(String(answer.id));
        } else {
          await promote(minted[Number(step.slice(1))], `T${step.slice(1)}`);
        }
      }

      const rows = await saves.list();
      expect(new Set(minted).size, `the order ${order.join(' ')} minted distinct ids`).toBe(minted.length);
      expect(new Set(idsOf(rows)).size,
        `and the library after ${order.join(' ')} holds one row per key`).toBe(rows.length);
      // EVERY MINTED ID IS STILL REACHABLE, exactly once: the shadow the defect wrote would be
      // present in the array and would answer for a key that is not its own.
      expect(minted.filter((id) => rows.filter((row) => String(row.id) === id).length === 1),
        `and every id minted under ${order.join(' ')} addresses exactly one row`).toEqual(minted);
      expect(rows.length, 'the town plus one row per mint').toBe(minted.length + 1);
    }
  });

  test('W4: determinism kept — the same seed root and the same claimed set mint the same id, and a clean library mints exactly what the count did', async () => {
    // (i) A CLEAN LIBRARY IS UNMOVED. With nothing promoted and nothing deleted the walk lands
    // exactly where the count did, so no identity this estate has already minted moves: indices
    // 0…k-1 are precisely the ids already claimed. Asserted against the id minter itself.
    const a = await mint('Greymoor');
    const b = await mint('Harrowfen');
    const c = await mint('Stonebrook');
    const rows = await saves.list();
    const byId = new Map(rows.map((row) => [String(row.id), row]));
    expect([a, b, c].map((answer) => byId.get(String(answer.id)).settlement.seed),
      'three counterparties of one town take the seeds of indices 0, 1 and 2, as they always have')
      .toEqual([0, 1, 2].map((n) => mintDmId(TOWN_SEED, PHANTOM_KIND, n)));

    // (ii) THE SAME SEED ROOT AND THE SAME CLAIMED SET MINT THE SAME ID. The whole scenario is
    // replayed on a clean device — mint, promote, mint — and the second mint's identity is the
    // same one, which is what makes a phantom reproducible at all.
    const replay = async () => {
      globalThis.localStorage.clear();
      seatStore();
      await saves.save(townEnvelope());
      storeState.savedSettlements = await saves.list();
      const first = await mint('Greymoor');
      await promote(first.id, 'Greymoor');
      const second = await mint('Harrowfen');
      const row = (await saves.list()).find((entry) => String(entry.id) === String(second.id));
      return [String(second.id), String(row.settlement.seed)];
    };
    const once = await replay();
    const twice = await replay();
    expect(twice, 'the same town and the same claimed set name the same counterparty, forever').toEqual(once);
    // AND THE FREE NAME IS NOT IN THE IDENTITY: the walk's index is a function of the seed root
    // and the claimed set alone, which is why a rename cannot move a phantom's world.
    globalThis.localStorage.clear();
    seatStore();
    await saves.save(townEnvelope());
    storeState.savedSettlements = await saves.list();
    const named = await mint('A Different Word Entirely');
    expect(String(named.id), 'the first counterparty of a clean town is the same id whatever it is called')
      .toBe(String(mintDmId(mintDmId(TOWN_SEED, PHANTOM_KIND, 0), PHANTOM_KIND, 0)));
  });

  test('W5: the local create REFUSES a claimed id by name before any write, and the door answers a declared refusal', async () => {
    // (i) THE PRECONDITION, DIRECT. The service is asked to create a row on a key the device
    // already holds; it refuses with its own code and the device is left exactly as it was.
    const before = JSON.stringify(await saves.list());
    let code = 'no throw';
    try {
      await saves.save({ ...townEnvelope(), name: 'Impostor' });
    } catch (err) {
      code = String(err?.code);
    }
    expect(code, 'the create names the broken precondition at the boundary that holds the rows')
      .toBe('save_requires_unclaimed_id');
    expect(JSON.stringify(await saves.list()), 'and the refused create wrote nothing at all').toBe(before);

    // (ii) AN UNCLAIMED EXPLICIT ID STILL WINS, exactly as it always has — the refusal is about
    // a CLAIM, never about carrying a key.
    const fresh = await saves.save({ ...townEnvelope(), id: 'row-caldwyn', name: 'Caldwyn' });
    expect(String(fresh), 'the caller\'s own unclaimed key is the row\'s key').toBe('row-caldwyn');

    // (iii) THE DOOR'S VIEW. The walk reads the STORE'S CACHE and the device is the authority,
    // so a stale cache is the one way the door can still reach a claimed key: the phantom is on
    // the device while the cache has forgotten it. The door answers a DECLARED refusal rather
    // than throwing, and — the point of the whole cure — the row already on the device is not
    // shadowed by a stub.
    const planted = await mint('Greymoor');
    const deviceBefore = JSON.stringify(await saves.list());
    seatStore({ savedSettlements: [] });
    const answer = await mintPhantomIntent(get, set, { name: 'Impostor' });
    expect(answer.ok, 'the door answered a refusal').toBe(false);
    // ⛔ THE MESSAGE IS SPELLED IN THE DOOR'S OWN SYMBOLS, NEVER IN A SENTENCE. The wording it
    // replaces ("…the reason is a member of…") aligned 18 fixed characters against a live
    // corpus variant (`general :: DS-GEN-8 :: steading row: organic :: vid 2`), which
    // `tests/lint/proseDrawnAnchors.walker.test.js` convicts by name. The asserted expression
    // is untouched; only the sentence a reader sees on a red is.
    expect(MINT_REFUSALS.includes(String(answer.reason)),
      'the answered word is declared by MINT_REFUSALS').toBe(true);
    expect(String(answer.reason), 'a device that refused the write is the door\'s save_failed state')
      .toBe('save_failed');
    expect(JSON.stringify(await saves.list()), 'the device holds exactly the rows it held').toBe(deviceBefore);
    expect((await saves.list()).filter((row) => String(row.id) === String(planted.id))
      .map((row) => row.settlement.name),
    'and the counterparty already on that key is reached, once, and is still itself').toEqual(['Greymoor']);
  });

  test('W6: EM-F3c — the door answers the key the SERVICE gave the row, and on this backend that is the mint\'s own, so nothing moves', async () => {
    // The door now replies with `saves.save()`'s answer rather than the record's id. On the
    // local backend `localSaveEntry` honours the envelope's explicit id, so the two are the same
    // string and this whole cure is invisible here — which is the point of reading the service's
    // answer instead of branching on which backend is configured.
    const update = vi.spyOn(saves, 'update');
    const answer = await mint('Greymoor');
    expect(answer.ok, 'the counterparty was founded').toBe(true);

    const rows = await saves.list();
    expect(rows.filter((row) => String(row.id) === String(answer.id))
      .map((row) => String(row.settlement.id)),
    'the receipt, the row and the record inside it are one key, reached once')
      .toEqual([String(answer.id)]);
    expect(update.mock.calls.length,
      'and the act owed no reconciling write: the backend took the mint\'s key first time').toBe(0);
    update.mockRestore();
  });

  test('W7: EM-F3c — an index a library row already claims by its SEED is walked past, whatever key that row wears', async () => {
    // THE SECOND COORDINATE, ISOLATED. This row carries index 0's phantom seed under a key the
    // mint could never produce — the shape EVERY row has on the cloud backend, where the table
    // assigns `gen_random_uuid()`. The id half of the claimed set cannot see it, so only the
    // seed half can stop the walk re-founding a world the library already holds.
    const seed0 = mintDmId(TOWN_SEED, PHANTOM_KIND, 0);
    const foreignKey = 'a-key-the-mint-never-made';
    await saves.save({
      id: foreignKey, name: 'Greymoor', tier: 'town', seed: seed0, config: null,
      aiData: {}, versionHistory: [],
      settlement: {
        id: foreignKey, kind: PHANTOM_KIND, name: 'Greymoor', seed: seed0,
        traits: { culture: 'coastal', size: 'town', terrain: 'forest' },
      },
    });
    storeState.savedSettlements = await saves.list();
    expect((await saves.list()).filter(isPhantomSave).length,
      'the library holds one counterparty, on a key of its own').toBe(1);

    const next = await mint('Harrowfen');
    expect(next.ok, 'the second counterparty was founded').toBe(true);
    const row = (await saves.list()).find((entry) => String(entry.id) === String(next.id));
    expect(String(row.settlement.seed),
      'and it takes the first index NO library row claims, so the two are two worlds')
      .toBe(mintDmId(TOWN_SEED, PHANTOM_KIND, 1));
    expect((await saves.list()).filter(isPhantomSave)
      .filter((entry) => String(entry.settlement.seed) === seed0)
      .map((entry) => String(entry.id)),
    'the planted counterparty is still the only holder of index 0').toEqual([foreignKey]);
  });
});
