/**
 * signInUnlocks.test.js — WHAT SIGNING IN UNLOCKS IS DERIVED, NEVER TYPED.
 *
 * ── THE DEFECT (the owner, 2026-09-19) ─────────────────────────────────────────
 * The Create page's at-cap sentence read "Sign in (free) to unlock city and metropolis
 * and save up to 3 drafts." It owed the reader a third size: the anonymous sizes are
 * hamlet, village and town — the line directly above it says exactly that — so a THORPE
 * is also something a free account unlocks. Two hand-typed lists, one screen apart, and
 * nothing in the estate held them to each other.
 *
 * ⭐ THE CURE IS A DERIVATION. config/tierFacts.js holds the ladder and the anonymous
 * SET; what signing in adds is the difference, Oxford-joined by the estate's own joiner.
 * Every sentence that names those sizes interpolates it. This file pins the derivation,
 * its joiner, and the fact that the two surfaces really read it.
 *
 * ⚠ WHAT THIS FILE DELIBERATELY DOES NOT CLAIM. It does not mount the hero at its cap:
 * the rendered-surface arms for that block live in tests/ui/homeHero*.test.jsx. What is
 * proved here is that the SOURCE of both sentences is the derivation rather than a list,
 * which is the property that was missing — a rendered-text pin would have gone on passing
 * against a correct-looking list that had quietly gone stale, which is how this defect
 * survived its last two reviews.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ANON_SIZES, SIGN_IN_UNLOCKS, SIZE_LABEL, SIZE_LADDER, oxfordList, signInUnlocksSizes,
} from '../../src/config/tierFacts.js';
import { en } from '../../src/copy/index.js';

const ROOT = process.cwd();
const HERO = readFileSync(join(ROOT, 'src/components/HomeHero.jsx'), 'utf8');

describe('THE DERIVATION', () => {
  test('the ladder and the anonymous set are both real, and one contains the other', () => {
    expect(SIZE_LADDER.length, 'the size ladder is empty').toBe(6);
    expect(ANON_SIZES.length, 'the anonymous set is empty').toBe(3);
    for (const key of ANON_SIZES) {
      expect(SIZE_LADDER, `the anonymous set names "${key}", which is not a rung`).toContain(key);
    }
    // Every rung has a reader-facing label, or a sentence would print a raw token.
    for (const key of SIZE_LADDER) expect(typeof SIZE_LABEL[key]).toBe('string');
  });

  test('signing in adds exactly the rungs anon did not have — thorpe among them', () => {
    expect([...SIGN_IN_UNLOCKS]).toEqual(SIZE_LADDER.filter((k) => !ANON_SIZES.includes(k)));
    expect(SIGN_IN_UNLOCKS, 'the owner\'s correction: a free account unlocks THORPE too').toContain('thorp');
    expect([...SIGN_IN_UNLOCKS]).toEqual(['thorp', 'city', 'metropolis']);
  });

  test('the sentence fragment is the owner\'s words, Oxford comma and all', () => {
    expect(signInUnlocksSizes()).toBe('thorpe, city, and metropolis');
    expect(signInUnlocksSizes(), 'the thorpe is missing again').toContain('thorpe');
  });

  test('`thorp` reads as "Thorpe" wherever a reader meets it (the two tables agree)', () => {
    // The display table said "Thorp" while the wizard's own size list said "Thorpe" —
    // one rung, two spellings, and the refusal sentences were on the wrong one.
    expect(SIZE_LABEL.thorp).toBe('Thorpe');
    expect(SIZE_LABEL.thorp).toBe(en.generate.sizes.thorp);
  });

  test('the joiner is the Oxford one, at every length (executed controls)', () => {
    expect(oxfordList([])).toBe('');
    expect(oxfordList(['a'])).toBe('a');
    expect(oxfordList(['a', 'b'])).toBe('a and b');
    expect(oxfordList(['a', 'b', 'c'])).toBe('a, b, and c');
    expect(oxfordList(['a', 'b', 'c', 'd'])).toBe('a, b, c, and d');
    // The comma before "and" at three is what makes it Oxford rather than the
    // ", and "-joined register domain/display/warRemembrance.js speaks.
    expect(oxfordList(['a', 'b', 'c'])).not.toBe('a, b and c');
  });
});

describe('THE SENTENCES THAT NAME THEM', () => {
  test('the hero renders the derivation and holds no list of its own', () => {
    expect(HERO, 'the at-cap sentence stopped deriving its sizes').toMatch(/signInUnlocksSizes\(\)/);
    expect(
      /unlock city and metropolis/.test(HERO),
      'the hero has a hand-typed size list again — that list is how the thorpe went missing',
    ).toBe(false);
    // …and the GAUGE reads the same facts, so what a visitor is offered and what they
    // are told they are missing cannot drift apart.
    expect(HERO).toMatch(/ANON_SIZES,\s*SIZE_LADDER/);
    expect(
      /const ANON_SIZES = \[/.test(HERO),
      'the hero re-declared the anonymous size set instead of reading the fact',
    ).toBe(false);
  });

  test('THE CENSUS: every sentence that names the unlock sizes agrees with the derivation', () => {
    // ⭐ FOUND, NOT LISTED. Every string leaf in the registry is walked; the ones that
    // talk about reaching or unlocking sizes are judged. A sixth sentence written
    // tomorrow is judged the day it lands, which a hand-kept roster could not do.
    const leaves = [];
    (function walk(node, path) {
      if (typeof node === 'string') { leaves.push({ path, text: node }); return; }
      if (Array.isArray(node)) { node.forEach((v, i) => walk(v, `${path}.${i}`)); return; }
      if (node && typeof node === 'object') for (const k of Object.keys(node)) walk(node[k], path ? `${path}.${k}` : k);
    }(en, ''));
    expect(leaves.length, 'the copy registry is empty').toBeGreaterThan(500);

    // A sentence NAMES the unlock sizes when it talks about reaching or unlocking and
    // either spells the ladder's top rung or interpolates the derivation. Both forms are
    // matched on purpose: a sentence that has been cured to `{sizes}` must stay in the
    // census, or curing one would quietly take it out of the walk.
    const naming = leaves.filter(({ text }) => /\b(reach|unlock)\b/i.test(text)
      && (/metropolis/i.test(text) || text.includes('{sizes}')));
    // ANTI-VACUITY: if the detector stopped matching, "all of them agree" would pass
    // over an empty set — which is exactly how these sentences drifted apart.
    expect(naming.length, 'no sentence names the unlock sizes — has the detector rotted?')
      .toBeGreaterThanOrEqual(4);

    const wrong = naming.filter(({ text }) => !(text.includes('{sizes}') || text.includes(signInUnlocksSizes())));
    expect(
      wrong.map(({ path, text }) => `${path}: ${text}`),
      `\nA sentence names the sizes a sign-in unlocks and does NOT agree with the derivation `
      + `("${signInUnlocksSizes()}").\n`
      + 'Interpolate {sizes} where the surface can supply a var (the refusal dictionary does, '
      + 'through RefusalNotice), or write the derived words and let this arm hold them. Never '
      + 'leave a hand-kept list: it has now gone stale twice.\n',
    ).toEqual([]);
  });

  test('the registry twin interpolates the sizes instead of spelling them', () => {
    const tpl = en.hero.anonCap.unlockTpl;
    expect(tpl, 'the registry twin lost its interpolation').toContain('{sizes}');
    expect(/city and metropolis/.test(tpl), 'the registry twin still types the list').toBe(false);
    // The anonymous set the `spent` line names is the SAME set the derivation subtracts,
    // so the two halves of the same screen agree by construction.
    for (const key of ANON_SIZES) {
      expect(en.hero.anonCap.spent.toLowerCase(), `the spent line does not name ${key}`)
        .toContain(SIZE_LABEL[key].toLowerCase());
    }
    expect(
      en.hero.anonCap.spent.toLowerCase().includes('thorpe'),
      'the spent line claims an anonymous visitor had a thorpe — the owner says they did not',
    ).toBe(false);
  });
});
