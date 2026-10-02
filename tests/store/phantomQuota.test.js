/**
 * @vitest-environment jsdom
 *
 * phantomQuota.test.js — EM-F1b's acceptance: A HIDDEN PHANTOM DOES NOT SPEND A SAVE
 * SLOT (the owner's decision, 2026-09-23; EM-F1, design §2.8 and §13, judgment 261).
 *
 * THE CLAIM. `activeSaveCount` — the ONE place a quota count over the library's saves is
 * computed — excludes a row whose blob carries EM-F1's discriminant, so three real saves
 * beside two phantoms read as THREE against a three-slot tier, the fourth REAL save is
 * refused exactly as it is today, and not one tier fact moves.
 *
 * ⭐ THE LIBRARY IS BUILT THROUGH THE REAL SAVE SERVICE, never assembled as a literal.
 * The substrate is LOCAL mode (the supabase mock below), the idiom EM-F1's own
 * `phantomSaves.test.js` established: every row below has been through save → list, so
 * the count is measured over rows the product produced rather than rows this file typed.
 *
 * ⛔ WHY jsdom RATHER THAN node, though the counting is pure. Acceptance case (3) is a
 * RENDERED gauge, and the owner's clause is about a paid-surface sentence that might now
 * lie. A sentence is proved by rendering it. The save service binds jsdom's own
 * localStorage, so the substrate is otherwise unchanged.
 *
 * ⛔ THE METER READS NO COUNT, AND THAT WAS MEASURED BEFORE THIS FILE WAS WRITTEN.
 * `SaveQuotaMeter` takes `used` as a PROP; the count is computed by its parent
 * (`SettlementsPanel`'s `activeSlotsUsed`). So `tests/components/saveQuotaMeter.test.jsx`
 * is untouched by this member — the meter's own contract did not change — and arm F3
 * hands the meter the value this module computes and reads the gauge back.
 *
 * ⛔ EVERY ENVELOPE CARRIES AN EXPLICIT ROW ID. The local save path falls back to
 * `Date.now()` for a row with no id, so two saves written inside one millisecond take the
 * same primary key — EM-F1 found this by re-running and cured its fixtures the same way.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

// Force LOCAL mode: the save service binds localStorage, never a network client.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
}));

import { codeOnly } from '../helpers/codeOnlySource.js';
import {
  PHANTOM_SAVE_KIND,
  activeSaveCount,
  inactiveRetentionCount,
  isPhantomSave,
} from '../../src/lib/saveAccess.js';
import { saves } from '../../src/lib/saves.js';
import { PHANTOM_KIND, isPhantomSave as isPhantomSaveLeaf, mintPhantom } from '../../src/domain/edit/phantoms.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { rollFrom } from '../../src/domain/edit/pools.js';
import { TIER_GATE } from '../../src/store/authSlice.js';
import { FREE_SAVE_LIMIT } from '../../src/config/tierFacts.js';
import SaveQuotaMeter from '../../src/components/settlements/SaveQuotaMeter.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The estate's own two producers, bound as EM-F1's injected tool bag. */
const TOOLS = Object.freeze({ mintId: mintDmId, roll: rollFrom });

/** The free tier's cap, read from the gate rather than typed — arm F4 pins it at 3. */
const FREE_CAP = TIER_GATE.free.maxSaves;

/** A save ENVELOPE carrying a minted phantom as its blob (EM-F1's `phantomEnvelope`). */
const phantomEnvelope = (rowId, seed, name, n) => {
  const record = /** @type {Record<string, unknown>} */ (mintPhantom(seed, name, n, TOOLS));
  return {
    id: rowId,
    name: String(record.name),
    tier: String(/** @type {Record<string, string>} */ (record.traits).size),
    settlement: record,
    seed: String(record.seed),
    config: null, aiData: {}, versionHistory: [],
  };
};

/**
 * An ordinary saved settlement — a row the viewer can open. No neighbour relationship, so
 * the save path takes its plain single-row branch and computes no back-link.
 */
const townEnvelope = (rowId, name) => ({
  id: rowId, name, tier: 'town', seed: `seed-${name.toLowerCase()}`,
  settlement: {
    _seed: `seed-${name.toLowerCase()}`, id: `set-${name.toLowerCase()}`,
    name, tier: 'town', npcs: [], factions: [],
  },
  config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

/**
 * THE LIBRARY UNDER TEST, written through the real service: three real saves the viewer
 * can open, and two phantoms the shelf hides.
 */
async function seedLibrary() {
  await saves.save(townEnvelope('row-ashford', 'Ashford'));
  await saves.save(phantomEnvelope('row-greymoor', 'seed-ashford', 'Greymoor', 0));
  await saves.save(townEnvelope('row-bellweather', 'Bellweather'));
  await saves.save(phantomEnvelope('row-harrowmere', 'seed-bellweather', 'Harrowmere', 1));
  await saves.save(townEnvelope('row-caldwyn', 'Caldwyn'));
  return saves.list();
}

/**
 * THE FOUR CAP GATES THIS ESTATE ACTUALLY SHIPS, spelled as their own files spell them and
 * named by SYMBOL so a reader can go and check each one. Arm F6 proves those files really
 * do read the counter below, so this is a re-run of the product's own arithmetic rather
 * than a second implementation floating free of it.
 *
 *   remainingSlots  — `AccountDataPrivacySection`'s over-limit import notice
 *   atCap           — `SaveQuotaMeter`'s `used >= max`, fed by `SettlementsPanel`
 *   canReactivate   — `SettlementsPanel`'s `canReactivateInactive` (tier-gated first)
 *   refusesOneMore  — `accountImportBody`'s phase-5 cap (`prepared.length > remaining`)
 */
const capFigures = (library, max, tier) => {
  const used = activeSaveCount(library);
  const remainingSlots = Number.isFinite(max) ? Math.max(0, max - used) : Infinity;
  return {
    used,
    remainingSlots,
    atCap: used >= max,
    canReactivate: tier === 'free' && used < Math.min(max || 0, 3),
    refusesOneMore: Number.isFinite(remainingSlots) && 1 > remainingSlots,
  };
};

/** Every `.js` / `.jsx` file under a directory, repo-relative — EM-F1's own walk. */
function walkSources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSources(full, out);
    else if (/\.jsx?$/.test(entry)) out.push(relative(ROOT, full).split('\\').join('/'));
  }
  return out;
}

/** The src corpus, read once, with comments and string TEXT blanked — a USE, never prose. */
const srcCode = () => walkSources(join(ROOT, 'src'))
  .map((rel) => /** @type {[string, string]} */ ([rel, codeOnly(readFileSync(join(ROOT, rel), 'utf8'))]));

beforeEach(() => {
  cleanup();
  globalThis.localStorage.clear();
});

describe('EM-F1b — a hidden phantom does not spend a save slot', () => {
  test('F1: three real saves plus two phantoms read as THREE toward a maxSaves-3 tier, and the fourth real save is refused as today', async () => {
    const library = await seedLibrary();

    // THE ANCHORS. Both halves are on the input, so the count below measures EXCLUSION
    // rather than an empty, broken or half-written library.
    expect(library.map((row) => row.name).sort(),
      'all five rows came back from the real save service').toEqual(
      ['Ashford', 'Bellweather', 'Caldwyn', 'Greymoor', 'Harrowmere']);
    expect(library.filter((row) => isPhantomSaveLeaf(row)),
      'exactly two of them are phantoms, read through EM-F1s OWN predicate rather than this members')
      .toHaveLength(2);

    // THE MEMBER. The two phantoms used to push this to five.
    expect(activeSaveCount(library),
      'a row the viewer can never reach does not spend a slot the viewer is sold').toBe(3);
    expect(await saves.count(),
      'and the save services own count() answers the same three, because it is this counter').toBe(3);

    // THE REFUSAL, UNCHANGED: at three of three every shipped cap gate is closed.
    expect(capFigures(library, FREE_CAP, 'free'), 'the library is FULL at three real saves: no slot'
      + ' remains, the meter is at cap, no inactive save may be reactivated, and one more import is'
      + ' refused')
      .toEqual({ used: 3, remainingSlots: 0, atCap: true, canReactivate: false, refusesOneMore: true });

    // THE DISCRIMINATION, so "refused" is not a constant: the SAME library one real save
    // lighter has a slot, and one real save heavier goes past the cap.
    const lighter = library.filter((row) => row.name !== 'Caldwyn');
    expect(capFigures(lighter, FREE_CAP, 'free'),
      'drop ONE REAL save and a slot opens — the counter is live, not pinned at the cap')
      .toEqual({ used: 2, remainingSlots: 1, atCap: false, canReactivate: true, refusesOneMore: false });

    await saves.save(townEnvelope('row-dunmoor', 'Dunmoor'));
    expect(activeSaveCount(await saves.list()),
      'and a FOURTH REAL save does move it, past the cap — only real saves ever did').toBe(4);

    // THE TWO FILTERS COMPOSE. An inactive phantom is excluded once for each reason, while
    // the RETENTION counter is deliberately untouched by this member: it answers a storage
    // question printed beside the quota card, not the quota itself.
    const inactivePhantom = {
      ...phantomEnvelope('row-dimhollow', 'seed-ashford', 'Dimhollow', 2),
      accessState: 'inactive_plan',
    };
    expect(activeSaveCount([...library, inactivePhantom]), 'an inactive phantom counts zero').toBe(3);
    expect(inactiveRetentionCount([...library, inactivePhantom]),
      'while the retention count still sees it, exactly as it saw every inactive row before').toBe(1);
  });

  test('F2: a tier with maxSaves Infinity is untouched — every premium figure is identical with the phantoms present and absent', async () => {
    const library = await seedLibrary();
    const unlimited = TIER_GATE.premium.maxSaves;
    expect(unlimited, 'the premium cap really is unbounded, or the arm below would be about a number')
      .toBe(Infinity);

    const withPhantoms = capFigures(library, unlimited, 'premium');
    const withoutPhantoms = capFigures(library.filter((row) => !isPhantomSaveLeaf(row)), unlimited, 'premium');

    expect(withPhantoms, 'an unbounded cap never binds: no slot is spent, nothing is at cap and nothing'
      + ' is refused. `canReactivate` is false because the reactivation path is gated on the FREE tier'
      + ' before it ever reads a count, not because a slot ran out')
      .toEqual({ used: 3, remainingSlots: Infinity, atCap: false, canReactivate: false, refusesOneMore: false });
    expect(withPhantoms, 'and the premium surface is identical whether the phantoms are in the library'
      + ' or not, so this member cannot have moved it').toEqual(withoutPhantoms);
  });
});

describe('EM-F1b — the surfaces that state the count', () => {
  test('F3: the quota meter reads THREE OF THREE, and the account cards unclamped "N / 3" is the sentence that would have lied', async () => {
    const library = await seedLibrary();
    const used = activeSaveCount(library);
    const raw = library.length;

    render(createElement(SaveQuotaMeter, { tier: 'free', used, max: FREE_CAP }));
    const bar = screen.getByTestId('quota-bar');
    expect([bar.getAttribute('aria-valuenow'), bar.getAttribute('aria-valuemax')],
      'THREE OF THREE: the gauge reads the three real saves against the three-slot cap').toEqual(['3', '3']);
    const label = screen.getByTestId('quota-label').textContent || '';
    expect(label, 'and the remaining-count sentence beside it is the honest one')
      .toMatch(/0 of 3 saves left on Wanderer/);
    expect(label, 'with the at-cap state carried in text, not colour alone').toMatch(/at cap/);

    // THE DISCRIMINATION, AND THE SENTENCE THAT ACTUALLY LIED. Handed the UNFILTERED five
    // the gauge announces 5 against a maximum of 3 — an impossible state a screen reader
    // reads aloud. The meter's own remaining-count sentence is CLAMPED (`Math.max(0, …)`)
    // and so reads the same at three and at five, which is exactly why the lie lived in the
    // gauge and in the account card's unclamped figure rather than here.
    cleanup();
    render(createElement(SaveQuotaMeter, { tier: 'free', used: raw, max: FREE_CAP }));
    expect(screen.getByTestId('quota-bar').getAttribute('aria-valuenow'),
      'the gauge moves with the number it is handed, so the reading above is a measurement').toBe('5');

    // The account card (`AccountSubscriptionSection`, fed by `AccountPage`'s `activeSaves`)
    // prints the count RAW: `{activeSaves} / {maxSaves}`. It is the paid-surface sentence
    // the owner's clause is about, and after this member it no longer overstates the library.
    expect(`${used} / ${FREE_CAP}`, 'the card now reads three of three').toBe('3 / 3');
    expect(`${raw} / ${FREE_CAP}`, 'where the unfiltered count printed a figure past the cap it sells')
      .toBe('5 / 3');
  });

  test('F4: no tier fact moved — the gates caps and the free save limit are the values they were', () => {
    expect([TIER_GATE.anon.maxSaves, TIER_GATE.free.maxSaves, TIER_GATE.premium.maxSaves],
      'the three caps are untouched by this member: no account gains or loses a slot')
      .toEqual([0, 3, Infinity]);
    expect(FREE_SAVE_LIMIT,
      'and the number every paid-surface sentence derives from is still the gates own')
      .toBe(TIER_GATE.free.maxSaves);
  });
});

describe('EM-F1b — the discriminant, the roster and the boundary', () => {
  test('F5: the two spellings of the discriminant are ONE word, and the two predicates agree row for row', async () => {
    expect(PHANTOM_SAVE_KIND, 'the word this module spells IS EM-F1s word. It is spelled twice because an'
      + ' import from here would red EM-F1s exact importer roster (arm A12) and would drag its leaf into'
      + ' the eager first-paint closure through saves.js; this assertion is the join').toBe(PHANTOM_KIND);

    const library = await seedLibrary();
    const inherited = Object.create({ kind: PHANTOM_KIND });
    const corpus = [
      ...library,
      { id: 'blobless', settlement: null },
      { id: 'inherited', settlement: inherited },
      { id: 'array-blob', settlement: [] },
      { id: 'other-kind', settlement: { kind: 'town' } },
      { id: 'no-settlement' },
      null,
      undefined,
    ];
    expect(corpus.map((row) => isPhantomSave(row)),
      'the two readings agree ROW FOR ROW — one fact read twice, so a rename on either side convicts here')
      .toEqual(corpus.map((row) => isPhantomSaveLeaf(row)));
    expect([corpus.filter((row) => isPhantomSave(row)).length, corpus.filter((row) => !isPhantomSave(row)).length],
      'the ANCHOR: the corpus really does hold both answers, so the agreement above is not two constant'
      + ' falses agreeing').toEqual([2, 10]);
    expect(isPhantomSave({ id: 'inherited', settlement: inherited }),
      'an INHERITED kind is not an own property and so is not a phantom — fail toward COUNTING the row,'
      + ' which is the direction that can never silently widen a paid cap').toBe(false);
  });

  test('F6: the quota counters importer roster under src is EXACT, and the raw-length census is now EMPTY', () => {
    const corpus = srcCode();
    expect(corpus.length, 'the src walk found nothing, so both rosters below would be vacuous')
      .toBeGreaterThan(400);

    const readers = corpus
      .filter(([, code]) => /import\s*\{[^}]*\bactiveSaveCount\b[^}]*\}\s*from/.test(code))
      .map(([rel]) => rel);
    expect([...readers].sort(), 'THE QUOTA COUNTERS READERS, EXACT IN BOTH DIRECTIONS. A surface that'
      + ' measures the library against a cap must come through this counter — an unlisted reader is a'
      + ' surface nobody checked for phantoms, and a missing listed one means a surface stopped counting.'
      + ' EM-F1c added the last three: the slot pre-flights that used to count a raw length')
      .toEqual([
        'src/components/AccountPage.jsx',
        'src/components/SettlementsPanel.jsx',
        'src/components/account/AccountDataPrivacySection.jsx',
        'src/lib/saves.js',
        'src/store/accountImportBody.js',
        'src/store/galleryImportMap.js',
        'src/store/galleryImportSettlement.js',
        'src/store/instantWorldBody.js',
        'src/store/saveMoments.js',
        'src/store/selectors.js',
      ].sort());

    // THE CENSUS OF THE SIBLINGS THAT DO NOT, AND IT IS NOW EMPTY (EM-F1c). Three shipped slot
    // pre-flights compared a RAW `.length` over `savedSettlements` against `maxSaves`, so they
    // counted an inactive save and a phantom alike — a divergence that PREDATED EM-F1b and was
    // frozen here while it lived. All three now ask this counter and appear in the roster above.
    // A FOURTH raw site reds the day it lands.
    const countsRawLength = ([, code]) => (
      /\(\s*[A-Za-z_$][A-Za-z0-9_$]*\.savedSettlements\s*\|\|\s*\[\]\s*\)\.length/.test(code)
      && /\bmaxSaves\b/.test(code)
    );
    expect(corpus.filter(countsRawLength).map(([rel]) => rel),
      'not one slot pre-flight counts with a raw length any more — a closed census, not an allowlist')
      .toEqual([]);

    // ⛔ AN EMPTY CENSUS IS THE VACUITY SHAPE, so the detector is shown ALIVE on the SAME
    // function the census just ran: it still convicts the exact spelling the three gates carried
    // one commit ago, and it acquits the cured spelling. Without this pair, a regex that had
    // silently gone blind would read as a cure.
    const BEFORE_CURE = "  const max = (typeof st.maxSaves === 'function') ? st.maxSaves() : Infinity;\n"
      + '  const activeNow = (st.savedSettlements || []).length;\n';
    const AFTER_CURE = "  const max = (typeof st.maxSaves === 'function') ? st.maxSaves() : Infinity;\n"
      + '  const activeNow = activeSaveCount(st.savedSettlements);\n';
    expect(countsRawLength(['probe', codeOnly(BEFORE_CURE)]),
      'the detector still convicts the spelling the gates carried at EM-F1b, so the emptiness above'
      + ' is a measurement rather than a blind regex').toBe(true);
    expect(countsRawLength(['probe', codeOnly(AFTER_CURE)]),
      'and it acquits the cured spelling, so the census emptied because the gates changed rather'
      + ' than because the rule widened').toBe(false);
  });

  test('F7: the F42 BOUNDARY — a metadata-projected row has no blob to read, and nothing under src reads that projection today', async () => {
    const library = await seedLibrary();
    const meta = await saves.listMeta();

    expect(meta.map((row) => row.settlement), 'the metadata projection nulls every blob DELIBERATELY —'
      + ' it exists to paint cards without pulling 84-220 kB per row')
      .toEqual([null, null, null, null, null]);
    expect(activeSaveCount(meta), 'so a meta row cannot be classified and COUNTS. The boundary is stated'
      + ' rather than hidden: the discriminant rides the blob by judgment 261, and an envelope key would'
      + ' be a column, which is the owners keystrokes').toBe(meta.length);
    expect(activeSaveCount(library), 'while the hydrated library the shipping grid actually paints reads'
      + ' three — the ANCHOR that this is a projection boundary and not a broken predicate').toBe(3);

    // WHY THAT IS SAFE TODAY, MEASURED RATHER THAN ASSUMED: the projection has no consumer
    // under src at all (F42's grid half was consciously deferred), so no quota surface can
    // reach a blob-less row. The day the grid adopts it, this arm names what it owes —
    // hydrate the blob, or carry the discriminant on the projection.
    const consumers = srcCode()
      .filter(([rel, code]) => rel !== 'src/lib/saves.js' && /\blistMeta\b/.test(code))
      .map(([rel]) => rel);
    expect(consumers,
      'zero consumers under src — the save service defines the projection and nothing calls it').toEqual([]);
  });
});
