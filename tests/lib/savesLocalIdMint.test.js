/**
 * @vitest-environment jsdom
 *
 * savesLocalIdMint.test.js — U22: TWO LOCAL SAVES IN ONE MILLISECOND NEVER SHARE AN ID.
 *
 * THE CLAIM. The local backend used to mint `Date.now()` for a save row with no id of its
 * own. That clock has millisecond resolution, so a pair of saves written inside ONE
 * millisecond took the SAME primary key — and every id compare in the save service
 * addresses rows by `String(id)`, so the pair became one identity: an update reached only
 * the first row (a rename could land on a DIFFERENT town), and a delete, which filters by
 * inequality, removed BOTH. The mint now carries a monotonic counter beside the clock and
 * checks the rows already on the device, so no two rows can converge.
 *
 * ⭐ THIS WAS FOUND BY THE PRODUCT, NOT INVENTED HERE. EM-F1's own re-run met it as a
 * timing-dependent red (its phantom row resolved to the town, green on slower runs) and
 * cured its FIXTURES by supplying explicit ids; both
 * `tests/store/phantomSaves.test.js` and `tests/store/phantomQuota.test.js` carry the
 * finding in their headers as a standing fixture rule. This suite cures it at the MINT, so
 * the rule stops being something every future fixture has to remember.
 *
 * ⛔ THE CLOCK IS FROZEN RATHER THAN RACED. A test that writes two saves and hopes they
 * land in one millisecond is the timing-dependent red itself, wearing a green coat: it
 * would pass on a fast machine and vanish on a slow one. `Date.now` is pinned for the
 * whole arm, which is the SAME-MILLISECOND CASE stated exactly rather than gambled on, and
 * the first assertion of each arm re-reads the clock so a fixture that silently stopped
 * freezing it cannot pass.
 *
 * ⛔ SUBSTRATE: LOCAL MODE (the supabase mock below), so the real save service binds its
 * real localStorage path and every hop — admission, the v2 migration, the canonical-shape
 * adapter — is executed rather than stubbed. The module is re-imported per arm so each one
 * meets a FRESH instance, which is also what arm U22-4 is about.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

/** The save service's own LOCAL_KEY — the device slot one backend below `list()`. */
const LOCAL_KEY = 'dnd_settlement_saves';

/** The frozen instant every write in this file lands on. Its value is irrelevant; its
 *  CONSTANCY is the fixture. */
const TICK = 1_774_000_000_000;

/** An ordinary save envelope with NO id of its own — the shape that reaches the mint. */
const townEnvelope = (name) => ({
  name,
  tier: 'town',
  seed: `seed-${name.toLowerCase()}`,
  settlement: {
    _seed: `seed-${name.toLowerCase()}`,
    id: `set-${name.toLowerCase()}`,
    name,
    tier: 'town',
    npcs: [],
    factions: [],
    neighbourNetwork: [],
  },
  config: { settType: 'town' },
  aiData: {},
  versionHistory: [],
});

/** @type {any} */
let saves;

beforeEach(async () => {
  localStorage.clear();
  vi.resetModules();
  vi.spyOn(Date, 'now').mockReturnValue(TICK);
  vi.doMock('../../src/lib/supabase.js', () => ({
    supabase: null, isConfigured: false, setSessionPersistence: () => {},
  }));
  ({ saves } = await import('../../src/lib/saves.js'));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('U22 — the local mint gives every row its own key', () => {
  test('U22-1: two saves inside one millisecond take two keys, and the key is still the clock-shaped number it always was', async () => {
    const idA = await saves.save(townEnvelope('Ashford'));
    const idB = await saves.save(townEnvelope('Bellweather'));
    const rows = await saves.list();

    // THE ANCHOR. The clock did not move between the two writes, so this really is the
    // same-millisecond pair — read off the rows the service wrote, not off the fixture.
    expect(Date.now(), 'the clock is frozen for the whole arm').toBe(TICK);
    expect(rows.map((row) => row.savedAt),
      'and both rows stamped that one instant, so the pair was written inside it')
      .toEqual([TICK, TICK]);
    expect(rows.map((row) => row.name).sort(),
      'the ANCHOR for the count below: both saves really landed').toEqual(['Ashford', 'Bellweather']);

    // THE MEMBER. One millisecond used to be one primary key.
    expect(String(idA), 'the second save does not take the first saves key').not.toBe(String(idB));
    expect(new Set(rows.map((row) => String(row.id))).size,
      'so the two persisted rows hold two identities, not one wearing two names').toBe(2);

    // THE SPELLING IS UNCHANGED, which is the whole reason this is not a UUID: the local
    // id stays a number that rises with the clock, so every `String(id)` compare, every
    // savedAt ordering and every row already on a device behave exactly as they did.
    expect([typeof idA, typeof idB], 'both keys are numbers, as every local id has been')
      .toEqual(['number', 'number']);
    expect([idA, idB], 'the clock is the high part and the counter is the low one: the first'
      + ' mint of a fresh instance IS the millisecond, and the second is the next integer')
      .toEqual([TICK, TICK + 1]);
  });

  test('U22-2: a delete removes the row it names and leaves its same-millisecond sibling standing', async () => {
    const idA = await saves.save(townEnvelope('Ashford'));
    await saves.save(townEnvelope('Bellweather'));

    expect(Date.now(), 'the clock is frozen, so the pair shares a millisecond').toBe(TICK);
    expect(await saves.list(), 'the ANCHOR: two rows are on the device before the delete')
      .toHaveLength(2);

    expect(await saves.delete(idA), 'the delete reports the row it removed').toBe(idA);
    expect((await saves.list()).map((row) => row.name),
      'and EXACTLY the named row is gone. The local delete filters by id INEQUALITY, so while'
      + ' the pair shared one key this call removed BOTH towns — a delete of one settlement'
      + ' silently taking another with it').toEqual(['Bellweather']);
  });

  test('U22-3: an update reaches the settlement it names, not whichever row was written last', async () => {
    const idA = await saves.save(townEnvelope('Ashford'));
    await saves.save(townEnvelope('Bellweather'));

    expect(Date.now(), 'the clock is frozen, so the pair shares a millisecond').toBe(TICK);
    await saves.update(idA, { name: 'Ashford (renamed)' });

    const rows = await saves.list();
    expect(rows, 'the ANCHOR: the update removed nothing').toHaveLength(2);
    expect(Object.fromEntries(rows.map((row) => [row.settlement.name, row.name])),
      'the rename landed on Ashford. The local update takes the FIRST row whose id matches,'
      + ' and the rows are stored newest-first, so while the pair shared one key this call'
      + ' renamed BELLWEATHER while Ashford kept its name')
      .toEqual({ Ashford: 'Ashford (renamed)', Bellweather: 'Bellweather' });
  });

  test('U22-4: a fresh module instance never re-mints a key the device is already holding', async () => {
    // A RELOAD, STATED EXACTLY: a row already on the device whose key is the very
    // millisecond this fresh instance is about to read. A counter alone starts at zero in
    // a new instance and would hand out that same key again, so the mint asks the device.
    localStorage.setItem(LOCAL_KEY, JSON.stringify([
      { ...townEnvelope('Prior'), id: TICK, savedAt: TICK },
    ]));

    const priorRows = await saves.list();
    expect(priorRows.map((row) => [row.name, row.id]),
      'the ANCHOR: the planted row was admitted and really does hold this millisecond as its key')
      .toEqual([['Prior', TICK]]);

    const id = await saves.save(townEnvelope('Ashford'));
    expect(String(id), 'the new row does not take the key the device already holds')
      .not.toBe(String(TICK));

    const rows = await saves.list();
    expect(rows.map((row) => row.name).sort(), 'and both rows are on the shelf')
      .toEqual(['Ashford', 'Prior']);
    expect(new Set(rows.map((row) => String(row.id))).size,
      'holding two identities, so nothing was written over').toBe(2);
  });

  test('U22-5 CONTROL: an explicit id is still the row key, so the cure only filled the hole', async () => {
    const id = await saves.save({ ...townEnvelope('Caldwyn'), id: 'row-caldwyn' });
    expect(id, 'the caller supplied the key and the service honoured it').toBe('row-caldwyn');

    const rows = await saves.list();
    expect(rows.map((row) => String(row.id)),
      'the device holds that exact key — the mint is a FALLBACK and never overrides a caller')
      .toEqual(['row-caldwyn']);
  });
});
