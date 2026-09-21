/**
 * tests/domain/tierStockImage.test.js — THE OWNER'S PAIRING, RUNG BY RUNG.
 *
 * Owner order ODQ §934.32, corrected the same day: "use the thorpe image for
 * thorpe and hamlets, village for village and towns, and city for cities and
 * metropolises." That is six rungs onto three paintings, and it is the kind of
 * mapping that rots silently — a rung added to the ladder, a file renamed, a
 * `capital` that used to resolve and stops — because a card with the wrong
 * painting still renders and a card with NO painting still renders.
 *
 * So this file asserts three different things that can each break alone:
 *   1. the PAIRING is exactly what the owner said, rung by rung;
 *   2. EVERY rung of src/data/constants.js TIER_ORDER resolves — a seventh tier
 *      cannot be added without someone deciding which painting it wears;
 *   3. the files are ON DISK. A URL constant that points at nothing is the
 *      failure this whole module exists to prevent, and no render test can see
 *      it (jsdom never fetches an <img>).
 */
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TIER_ORDER } from '../../src/data/constants.js';
import {
  TIER_STOCK_IMAGES,
  TIER_STOCK_LADDER,
  TIER_STOCK_SCENE,
  settlementCardImage,
  tierStockImage,
} from '../../src/domain/display/tierStockImage.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The owner's words, as a table. */
const OWNER_PAIRING = Object.freeze({
  thorp: 'thorpe',
  hamlet: 'thorpe',
  village: 'village',
  town: 'village',
  city: 'city',
  metropolis: 'city',
});

describe('tierStockImage — the stock painting for a tier', () => {
  it('pairs the six rungs onto three paintings exactly as the owner stated', () => {
    const wrong = [];
    for (const [tier, scene] of Object.entries(OWNER_PAIRING)) {
      const got = tierStockImage(tier);
      const want = TIER_STOCK_IMAGES[scene];
      if (got !== want) wrong.push(`${tier}: expected the ${scene} painting (${want}), got ${got}`);
    }
    expect(wrong, `the tier pairing drifted from the owner's order:\n  ${wrong.join('\n  ')}`).toEqual([]);
    // …and there really are THREE paintings, not six or one.
    expect(new Set(Object.values(TIER_STOCK_IMAGES)).size).toBe(3);
  });

  it('every rung of the live ladder resolves (a new tier cannot ship imageless)', () => {
    // ANTI-VACUITY: the ladder must be the real one and non-trivial, or the loop
    // below proves nothing.
    expect(TIER_ORDER.length, 'the tier ladder is empty or missing').toBeGreaterThanOrEqual(6);
    expect(TIER_STOCK_LADDER).toEqual([...TIER_ORDER]);
    const unmapped = TIER_ORDER.filter((tier) => !tierStockImage(tier));
    expect(
      unmapped,
      `these ladder rungs have no stock painting, so their cards would render empty: ${unmapped.join(', ')}.`
      + ' Add them to TIER_STOCK_SCENE — deciding which painting a new tier wears is a choice, not a default.',
    ).toEqual([]);
  });

  it('reconciles the two spellings the estate actually carries', () => {
    // `thorpe` is the PAINTING's spelling; the ladder says `thorp`.
    expect(tierStockImage('thorpe')).toBe(tierStockImage('thorp'));
    // `capital` reaches display code as a tier although the ladder tops out at
    // `metropolis` (curated sample data, the size-label map).
    expect(tierStockImage('capital')).toBe(tierStockImage('metropolis'));
    // Case and whitespace are the shapes a DB column hands you.
    expect(tierStockImage('  Village ')).toBe(TIER_STOCK_IMAGES.village);
  });

  it('answers null — never a guess — for anything that is not a tier', () => {
    for (const junk of [null, undefined, '', '   ', 'hamlets', 'Town of Oakmere', 42, {}, []]) {
      expect(tierStockImage(junk), `guessed a painting for ${JSON.stringify(junk)}`).toBeNull();
    }
    // anchored: the pairing test above proves real tiers DO resolve on this same
    // function, so these nulls are a refusal to guess and not a dead module.
  });

  it('the owner\'s own image always wins, and a blank string is not an image', () => {
    expect(settlementCardImage('https://cdn.example/mine.jpg', 'village')).toBe('https://cdn.example/mine.jpg');
    expect(settlementCardImage('', 'village')).toBe(TIER_STOCK_IMAGES.village);
    expect(settlementCardImage('   ', 'village')).toBe(TIER_STOCK_IMAGES.village);
    expect(settlementCardImage(null, 'town')).toBe(TIER_STOCK_IMAGES.village);
    // No tier and no owner image is the one case with no answer — the callers
    // keep their own empty state for it.
    expect(settlementCardImage(null, null)).toBeNull();
  });

  it('every painting it names is actually on disk', () => {
    // ⛔ THE ARM THAT NO RENDER TEST CAN REPLACE. jsdom never fetches an <img>,
    // so a constant pointing at a deleted or renamed file passes every component
    // test in this estate and ships a broken card.
    const missing = Object.entries(TIER_STOCK_IMAGES)
      .filter(([, url]) => !existsSync(join(ROOT, 'public', url.replace(/^\//, ''))))
      .map(([scene, url]) => `${scene} → ${url}`);
    expect(missing, `stock paintings named but not shipped:\n  ${missing.join('\n  ')}`).toEqual([]);
  });

  it('carries no scene key that points at a painting it does not have', () => {
    const dangling = Object.entries(TIER_STOCK_SCENE)
      .filter(([, scene]) => !TIER_STOCK_IMAGES[scene])
      .map(([tier, scene]) => `${tier} → ${scene}`);
    expect(dangling, `tier keys pointing at an unknown scene:\n  ${dangling.join('\n  ')}`).toEqual([]);
  });
});
