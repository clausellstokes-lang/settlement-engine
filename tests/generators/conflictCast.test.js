/**
 * conflictCast.test.js — EVERY ISSUE DECLARES ITS CAST (COHERENCE-QUARREL cure 1; the chair's
 * charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3).
 *
 * The defect, measured on the lane's corpus (360 settlements, every dial on random, seeds
 * `quarrel-<tier>-<i>`) at 99bcc6944: "Military conscription of guild apprentices" stood in 113
 * quarrels, most of them between two powers neither of which is a guild or a soldier (the
 * critic's own example: a Town Council against the Landed Gentry).
 */
import { describe, expect, test } from 'vitest';

import { BASE_ISSUES, CAST_KINDS, STRESS_ISSUES, castFilled, kindsOfPower } from '../../src/generators/power/conflictIssues.js';
import { generateConflicts } from '../../src/generators/powerGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

const ALL_ISSUES = [...BASE_ISSUES, ...Object.values(STRESS_ISSUES).flat()];

/**
 * The words that name a kind of power in an issue, and the kinds that answer for them. An issue
 * that uses the words must hold one of the kinds in its cast or in what it touches.
 */
const POWER_WORDS = [
  { words: /\bguild/i, kinds: ['economy'] },
  { words: /\b(?:merchant|trader|craft)/i, kinds: ['economy'] },
  { words: /\b(?:church|temple|clergy|priest|religious|tithe)/i, kinds: ['religious'] },
  { words: /\b(?:military|conscription|garrison|soldier|guard)\b/i, kinds: ['military', 'governing', 'government', 'council'] },
  { words: /\bcouncil\b/i, kinds: ['council'] },
  { words: /\b(?:arcane|magic|spell|wizard)/i, kinds: ['magic'] },
  { words: /\b(?:criminal|thieves|smuggl)/i, kinds: ['criminal'] },
  { words: /\b(?:noble|lord|gentry|estate)\b/i, kinds: ['noble'] },
  { words: /\bgoverning authority\b/i, kinds: ['governing'] },
];

const seeded = (seed, body) => {
  const previous = setActiveRng(createPRNG(seed));
  try { return body(); } finally { clearActiveRng(previous); }
};

describe('every issue declares its cast', () => {
  test('each issue carries a cast of known kinds', () => {
    for (const issue of ALL_ISSUES) {
      expect(Array.isArray(issue.cast), issue.issue).toBe(true);
      expect(issue.cast.length, issue.issue).toBeLessThanOrEqual(2);
      for (const slot of issue.cast) {
        expect(slot.length, issue.issue).toBeGreaterThan(0);
        for (const kind of slot) expect(CAST_KINDS, `${issue.issue}: ${kind}`).toContain(kind);
      }
      for (const kind of issue.touches || []) expect(CAST_KINDS, `${issue.issue}: ${kind}`).toContain(kind);
    }
  });

  test('an issue that names a kind of power declares it, as a party or as a power it touches', () => {
    const undeclared = [];
    for (const issue of ALL_ISSUES) {
      const declared = new Set([...issue.cast.flat(), ...(issue.touches || [])]);
      for (const { words, kinds } of POWER_WORDS) {
        if (words.test(issue.issue) && !kinds.some((k) => declared.has(k))) undeclared.push(`${issue.issue} (${words})`);
      }
    }
    expect(undeclared).toEqual([]);
  });

  test("a power's kinds are read off its row", () => {
    expect([...kindsOfPower({ name: 'Town Council', category: 'government', isGoverning: true })].sort())
      .toEqual(['council', 'governing', 'government']);
    expect([...kindsOfPower({ name: 'Landed Gentry', category: 'noble' })]).toEqual(['noble']);
  });

  test('a two-slot cast needs a different party in each slot', () => {
    const issue = { cast: [['religious'], ['economy']] };
    expect(castFilled(issue, new Set(['religious']), new Set(['economy']))).toBe(true);
    expect(castFilled(issue, new Set(['economy']), new Set(['religious']))).toBe(true);
    expect(castFilled(issue, new Set(['religious', 'economy']), new Set(['noble']))).toBe(false);
  });
});

describe('the picker offers a pair only the issues its two powers can fill', () => {
  const powers = [
    { faction: 'Town Council', category: 'government', isGoverning: true },
    { faction: 'Landed Gentry', category: 'noble' },
  ];
  const cast = [
    { id: 'a', name: 'Ada', memberships: [{ power: 'Town Council', rank: 1 }] },
    { id: 'b', name: 'Bran', memberships: [{ power: 'Landed Gentry', rank: 1 }] },
  ];
  const rels = [{ from: 'a', to: 'b', type: 'rival' }];

  test('a Town Council against the Landed Gentry never quarrels over conscripting guild apprentices', () => {
    const drawn = new Set();
    for (let i = 0; i < 80; i++) {
      for (const conflict of seeded(`cast-${i}`, () => generateConflicts(powers, rels, {}, [], cast))) drawn.add(conflict.issue);
    }
    // anchored: the pair quarrels in every town, so the set is a measurement of WHICH issues it draws
    expect(drawn.size).toBeGreaterThan(0);
    // anchored: drawn.size > 0 above, so this reads which issues the pair drew
    expect([...drawn]).not.toContain('Military conscription of guild apprentices');
    for (const issue of drawn) {
      const row = ALL_ISSUES.find((candidate) => candidate.issue === issue);
      expect(row && castFilled(row, kindsOfPower({ name: 'Town Council', category: 'government', isGoverning: true }), kindsOfPower({ name: 'Landed Gentry', category: 'noble' })), issue).toBe(true);
    }
  });
});
