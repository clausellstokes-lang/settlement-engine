/**
 * tests/copy/landingNarrationGrounding.test.js — THE LANDING'S NARRATED CARD SAYS
 * ONLY WHAT ITS RECEIPTS HOLD.
 *
 * The fixture's one authored field, voice.narrated (STOCK_NARRATION in
 * scripts/generate-landing-fixture.mjs), "must be re-grounded whenever the fixture is
 * regenerated" — and nothing read it. Between 2026-11-07 and 2026-11-10 the fixture was
 * re-emitted through its door three times with `--check` green each time while three of
 * the narration's four sentences named a quarrel (the Elder Council and the Religious
 * Authorities over conscripted apprentices), a mayor (Odhrán MacCarthy) and a rivalry
 * (Hector Gallagher and Inghean MacCarthy) the engine no longer derived for lf-033.
 * The freshness walker compares bytes; this file compares the narration to the fields
 * beside it (FOUNDING-WORLDS, 2026-11-10; the chair's rulings N1 and N3).
 *
 * Two laws, each anchored:
 *   (i)  every proper name the narration says is held by another fixture field;
 *   (ii) every figure the narration says is derivable from voice.receipts — the claim
 *        table below sets each phrase beside the receipt field that licenses it, and
 *        no number-word in the narration falls outside the table.
 */
import { describe, it, expect } from 'vitest';
import { fixture } from '../../src/components/home/landingFixture.js';

const narrated = String(fixture.voice.narrated);
/** The fixture with its one authored field removed: what the engine itself said. */
const derived = JSON.stringify({ ...fixture, voice: { ...fixture.voice, narrated: null } });
/** @param {string} label */
const receipt = (label) => String(fixture.voice.receipts.find((r) => r.label === label)?.text || '');

const NUMBER_WORDS = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|hundred|thousand|half|twice|doubled|tripled|\d+)\b/gi;

/**
 * Each figure the narration states, the receipt that licenses it, and the check.
 * @type {Array<{ phrase: string, words: string[], licensed: () => boolean }>}
 */
const CLAIMS = [
  {
    phrase: 'three chances of it against two of nothing',
    words: ['three', 'two'],
    // route: "… pool: road, road, road, isolated, isolated."
    licensed: () => {
      const pool = (receipt('route').split('pool:')[1] || '').replace(/\.$/, '').split(',').map((s) => s.trim()).filter(Boolean);
      return pool.filter((p) => p === fixture.forge.config.tradeRouteAccess || p === 'road').length === 3
        && pool.filter((p) => p === 'isolated').length === 2;
    },
  },
  {
    phrase: 'four chances in a hundred, more than doubled',
    words: ['four', 'hundred', 'doubled'],
    // institution: "blacksmith · selected (Base chance 4% lifted by ×2.50 from nearby resources + terrain.)"
    licensed: () => {
      const text = receipt('institution');
      const base = Number(text.match(/Base chance (\d+)%/)?.[1]);
      const lift = Number(text.match(/×(\d+(?:\.\d+)?)/)?.[1]);
      return /^blacksmith · selected/.test(text) && base === 4 && lift > 2 && lift < 3
        && /nearby resources \+ terrain/.test(text);
    },
  },
];

describe('the narrated card says only what its receipts hold', () => {
  it('the narration and the receipts are both present (anti-vacuity)', () => {
    expect(narrated.length).toBeGreaterThan(80);
    expect(fixture.voice.receipts.length).toBeGreaterThanOrEqual(3);
    expect(receipt('route')).toMatch(/pool:/);
  });

  it('every proper name in the narration is held by another fixture field', () => {
    // A capitalised word that does not open a sentence is a name. Sentence openers are
    // excluded by position, so "The" never counts and a name never hides behind it.
    const names = [...narrated.matchAll(/(?<![.!?]\s|^)\b([A-ZÀ-Þ][\p{L}’']+(?:\s[A-ZÀ-Þ][\p{L}’']+)*)/gu)].map((m) => m[1]);
    expect(names, 'the town itself is named, so the scan is reading names').toContain(fixture.town.name);
    const unheld = names.filter((n) => !derived.includes(n));
    expect(unheld, `the narration names what no derived field holds: ${unheld.join(', ')}`).toEqual([]);
  });

  it('every figure the narration states is licensed by a receipt', () => {
    for (const claim of CLAIMS) {
      expect(narrated, `the narration no longer says "${claim.phrase}" — re-key the table with the copy`).toContain(claim.phrase);
      expect(claim.licensed(), `the receipt no longer licenses "${claim.phrase}"`).toBe(true);
    }
    const tabled = new Set(CLAIMS.flatMap((c) => c.words));
    const stated = (narrated.match(NUMBER_WORDS) || []).map((w) => w.toLowerCase());
    expect(stated.length, 'the scan finds the figures the table covers').toBeGreaterThan(0);
    expect(stated.filter((w) => !tabled.has(w)), 'a figure the claim table does not license').toEqual([]);
  });

  it('the cleared stands are the resource receipt\'s depletion', () => {
    expect(narrated).toContain('the mountain stands are being cleared faster than they grow back');
    expect(receipt('resource')).toMatch(/^mountain_timber · present but depleted \(The accessible mountain stands have been cleared faster than they can regrow\.\)$/);
  });
});
