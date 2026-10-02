/**
 * @vitest-environment jsdom
 *
 * savesNewSaveIdFallback.test.js — U52: newSaveId'S FALLBACK NEVER REPEATS IN ONE
 * MILLISECOND.
 *
 * THE CLAIM. `newSaveId` mints the key a save must carry BEFORE it is inserted, because
 * the bidirectional neighbour link embeds the new save's id in BOTH rows and writes them
 * through one batch RPC. Where `crypto.randomUUID` is missing it fell back to
 * `Date.now()` alone — millisecond resolution — so two saves minted inside one
 * millisecond took the SAME uuid, and the server was asked to create two settlements
 * under one primary key. That is U22's collision shape exactly, in the other backend:
 * U22 cured the local mint, and this arm cures the Supabase one THROUGH THE SAME
 * FUNCTION (`newLocalSaveId`, called with an empty row list) rather than a second
 * spelling of the same idiom.
 *
 * ⛔ THE CLOCK IS FROZEN RATHER THAN RACED — U22's rule, kept verbatim. A test that
 * mints twice and hopes both land in one millisecond IS the timing-dependent red wearing
 * a green coat: green on a fast machine, gone on a slow one. `Date.now` is pinned for the
 * whole arm and re-read inside it, so the same-millisecond case is STATED rather than
 * gambled on.
 *
 * ⛔ AND THE FALLBACK IS ENTERED BY ITS OWN DOOR. `randomUUID` is shadowed to `undefined`
 * on a crypto object that still inherits everything else, and each arm asserts BOTH that
 * `randomUUID` is gone and that the rest of `crypto` is still there — so an arm cannot
 * pass because the whole of `crypto` vanished and took some other code path with it.
 *
 * ⛔ SUBSTRATE: THE REAL SUPABASE SAVE PATH. `isConfigured` is true and the module's own
 * `supabaseSave` runs — owner assertion, the v2 migration, the partner name query, the
 * real `buildNeighbourBackLink`, and the batch RPC — so the minted id is observed BOTH as
 * the value the service returns AND as the `creates[0].id` the server is asked to write.
 * The second is the one that shows the damage: two settlements, one primary key.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

/** The frozen instant every mint in this file lands on. Its CONSTANCY is the fixture. */
const TICK = 1_774_000_000_000;

/** The v4 shape the fallback has always produced, and still must. */
const FALLBACK_SHAPE = /^00000000-0000-4000-8000-[0-9a-f]{12}$/;

/** The already-saved partner the new settlement is generated against. */
const partnerRow = () => ({
  id: 'partner-eastgate',
  name: 'Eastgate',
  tier: 'town',
  access_state: 'active',
  updated_at: new Date(TICK).toISOString(),
  data: {
    name: 'Eastgate', tier: 'town', npcs: [], factions: [], neighbourNetwork: [],
  },
});

/** A new settlement generated AS A TRADE PARTNER of Eastgate — the shape that reaches
 *  the pre-mint, because only a generated neighbour needs an id before insert. */
const linkedEntry = (name) => ({
  name,
  tier: 'village',
  settlement: {
    name, tier: 'village', npcs: [], factions: [],
    neighborRelationship: { name: 'Eastgate', tier: 'town', relationshipType: 'trade_partner' },
  },
});

/** @type {any} */
let saves;
/** @type {any[]} */
let rpcPayloads;
/** The crypto object every arm installs — the real one with ONE member shadowed. */
let realCrypto;

async function bootService({ randomUUID }) {
  vi.resetModules();
  rpcPayloads = [];
  vi.spyOn(Date, 'now').mockReturnValue(TICK);
  vi.stubGlobal('crypto', Object.create(realCrypto, {
    randomUUID: { value: randomUUID, configurable: true, enumerable: true },
  }));
  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: {
      auth: { getUser: () => Promise.resolve({ data: { user: { id: 'owner-a' } } }) },
      from: () => ({
        select: () => ({ eq: () => Promise.resolve({ data: [partnerRow()], error: null }) }),
      }),
      rpc: (_name, payload) => {
        rpcPayloads.push(payload);
        return Promise.resolve({ data: 1, error: null });
      },
    },
  }));
  ({ saves } = await import('../../src/lib/saves.js'));
}

beforeEach(() => { realCrypto = globalThis.crypto; });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('U52 — the pre-insert mint has no same-millisecond hole', () => {
  test('U52-1: two saves minted inside one millisecond take two keys, and the server is asked to create two rows under two keys', async () => {
    await bootService({ randomUUID: undefined });

    // THE FIXTURE, STATED: the fallback is the path under test, and it is reached because
    // randomUUID is gone — not because crypto itself is.
    expect(globalThis.crypto?.randomUUID, 'randomUUID is absent, so the fallback mints')
      .toBe(undefined);
    expect(typeof globalThis.crypto.getRandomValues,
      'and the REST of crypto is untouched, so no other path changed under the arm')
      .toBe('function');

    const idA = await saves.save(linkedEntry('Westford'));
    const idB = await saves.save(linkedEntry('Northgate'));

    // THE ANCHORS. The clock did not move between the two mints — so this really is the
    // same-millisecond pair — and both saves reached the batch RPC, which is where the
    // pre-minted id is spent.
    expect(Date.now(), 'the clock is frozen for the whole arm').toBe(TICK);
    expect(rpcPayloads, 'both saves took the bidirectional-link path and wrote a batch')
      .toHaveLength(2);

    // THE MEMBER. One millisecond used to be one key.
    expect(String(idA), 'the second save does not take the first save\'s key')
      .not.toBe(String(idB));

    // AND THE DAMAGE THAT WAS, read where it would have landed: the id is embedded in the
    // row the server is told to CREATE, so a repeat is two settlements under one primary
    // key rather than a curious return value.
    expect(rpcPayloads.map((payload) => payload.creates[0].id),
      'the two rows the server is asked to create carry the two ids the service returned')
      .toEqual([idA, idB]);

    // THE SHAPE IS UNCHANGED, which is why this is not a second id idiom: still the v4
    // spelling, still clock-led, so nothing that reads, stores or validates one of these
    // sees a different kind of value.
    expect([FALLBACK_SHAPE.test(String(idA)), FALLBACK_SHAPE.test(String(idB))],
      'both keys keep the v4 shape the fallback has always produced').toEqual([true, true]);
    expect(String(idA),
      'and the clock is still the HIGH part: the first mint of a fresh module instance IS'
      + ' this millisecond, which is what keeps these ids rising with time')
      .toBe(`00000000-0000-4000-8000-${TICK.toString(16).padStart(12, '0').slice(-12)}`);
  });

  test('U52-2 CONTROL: where crypto.randomUUID exists it is still the only source, so the cure only filled the hole', async () => {
    const minted = ['11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222'];
    let next = 0;
    await bootService({ randomUUID: () => minted[next++] });

    expect(typeof globalThis.crypto.randomUUID,
      'the ANCHOR: this arm runs the branch the fallback is a fallback TO').toBe('function');

    const idA = await saves.save(linkedEntry('Westford'));
    const idB = await saves.save(linkedEntry('Northgate'));

    expect([idA, idB],
      'the platform minted both keys and the service used them verbatim — the fallback is'
      + ' never consulted while randomUUID answers').toEqual(minted);
    expect(rpcPayloads.map((payload) => payload.creates[0].id),
      'and those are the keys the server was asked to write').toEqual(minted);
  });
});
