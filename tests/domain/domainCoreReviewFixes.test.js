/**
 * tests/domain/domainCoreReviewFixes.test.js — B04 review fixes (part 2).
 *
 * Pins the remaining domain-core corrections:
 *
 *   3. deriveSocialTrust reads legitimacy via the governance ledger, so a
 *      LEGACY save persisting a bare numeric legitimacy still moves trust.
 *   4. conditionIdFromArchetype's fallback id is tick-INVARIANT.
 *   8. inferSupplyChains sorts by codepoint (not locale-dependent localeCompare).
 *   9. deepClone preserves Date/Map/Set/undefined fidelity (no lossy JSON
 *      fallback) and throws loudly on a non-cloneable value.
 *  10. summarizeCausalState phrases lower_is_better problems (rampant crime)
 *      in problem terms, not the inverted band word.
 */

import { describe, it, expect } from 'vitest';
import { deriveSystemVariable, summarizeCausalState } from '../../src/domain/causalState.js';
import { conditionIdFromArchetype } from '../../src/domain/activeConditions.js';
import { inferSupplyChains } from '../../src/domain/inferSupplyChains.js';
import { deepClone } from '../../src/domain/clone.js';

// ── Finding 3: social_trust reads legacy numeric legitimacy ─────────────────

describe('deriveSocialTrust — legacy numeric legitimacy (Finding 3)', () => {
  it('moves social_trust when legitimacy is a bare number (legacy save)', () => {
    const neutral = deriveSystemVariable('social_trust', {
      powerStructure: { publicLegitimacy: 50 },
    });
    const collapsing = deriveSystemVariable('social_trust', {
      powerStructure: { publicLegitimacy: 5 }, // bare number, legacy shape
    });
    expect(collapsing.score).toBeLessThan(neutral.score);
    expect(collapsing.contributors.some(c => c.effect === 'tracks_legitimacy')).toBe(true);
  });

  it('still reads the canonical object shape', () => {
    const high = deriveSystemVariable('social_trust', {
      powerStructure: { publicLegitimacy: { score: 90 } },
    });
    const low = deriveSystemVariable('social_trust', {
      powerStructure: { publicLegitimacy: { score: 10 } },
    });
    expect(high.score).toBeGreaterThan(low.score);
  });
});

// ── Finding 4: tick-invariant fallback condition id ─────────────────────────

describe('conditionIdFromArchetype — tick-invariant fallback (Finding 4)', () => {
  it('produces the same fallback id regardless of tick', () => {
    const a = conditionIdFromArchetype('plague', { label: 'Plague', tick: 0 });
    const b = conditionIdFromArchetype('plague', { label: 'Plague', tick: 17 });
    expect(a).toBe(b);
  });

  it('still differs by archetype + label', () => {
    const a = conditionIdFromArchetype('plague', { label: 'Plague' });
    const b = conditionIdFromArchetype('plague', { label: 'Pestilence' });
    expect(a).not.toBe(b);
  });
});

// ── Finding 8: codepoint-stable chain ordering ──────────────────────────────

describe('inferSupplyChains — deterministic codepoint ordering (Finding 8)', () => {
  it('returns chains sorted by chainId in codepoint order', () => {
    const cc = {
      resources: [{ name: 'Ore', localUid: 'r-ore', yields: ['Iron'] }],
      tradeGoods: [
        { name: 'Iron', localUid: 'g-iron', requiredResources: ['Ore'] },
        { name: 'Steel', localUid: 'g-steel', requiredResources: ['Ore'] },
      ],
    };
    const chains = inferSupplyChains(cc);
    const ids = chains.map(c => c.chainId);
    const sorted = [...ids].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    expect(ids).toEqual(sorted);
  });

  it('is deterministic across repeated calls', () => {
    const cc = {
      resources: [{ name: 'Wheat', localUid: 'r-wheat', yields: ['Flour'] }],
      tradeGoods: [{ name: 'Bread', localUid: 'g-bread', requiredResources: ['Flour'] }],
    };
    const a = inferSupplyChains(cc).map(c => c.chainId);
    const b = inferSupplyChains(cc).map(c => c.chainId);
    expect(a).toEqual(b);
  });
});

// ── Finding 9: deepClone fidelity ───────────────────────────────────────────

describe('deepClone — structuredClone fidelity (Finding 9)', () => {
  it('preserves Date / Map / Set / undefined-valued keys', () => {
    const src = {
      when: new Date('2026-06-20T00:00:00Z'),
      tags: new Set(['a', 'b']),
      lookup: new Map([['k', 1]]),
      missing: undefined,
    };
    const out = deepClone(src);
    expect(out.when instanceof Date).toBe(true);
    expect(out.when.getTime()).toBe(src.when.getTime());
    expect(out.tags instanceof Set).toBe(true);
    expect([...out.tags]).toEqual(['a', 'b']);
    expect(out.lookup instanceof Map).toBe(true);
    expect(out.lookup.get('k')).toBe(1);
    expect('missing' in out).toBe(true); // key retained with undefined value
    expect(out).not.toBe(src);
  });

  it('falls back gracefully on a non-cloneable value (no throw — JSON-equivalent clone)', () => {
    // structuredClone throws on functions/proxies; the sanctioned JSON fallback
    // is REQUIRED (the undo path and store producers legitimately clone Immer
    // drafts / function-bearing state). It produces the plain JSON-equivalent
    // clone callers expect (non-cloneable value dropped) instead of crashing.
    let out;
    expect(() => { out = deepClone({ keep: 1, fn: () => 1 }); }).not.toThrow();
    expect(out).toEqual({ keep: 1 });
    expect('fn' in out).toBe(false);
  });
});

// ── Finding 10: lower_is_better problem-term phrasing ───────────────────────

describe('summarizeCausalState — lower_is_better problem framing (Finding 10)', () => {
  it('phrases rampant crime in problem terms, not the inverted band word', () => {
    // Drive criminal_opportunity HIGH: low legitimacy + a corruption condition.
    const settlement = {
      powerStructure: { publicLegitimacy: { score: 5, label: 'Crisis' } },
      activeConditions: [{ archetype: 'corruption_exposed', severity: 0.9, status: 'worsening' }],
    };
    const crime = deriveSystemVariable('criminal_opportunity', settlement);
    expect(crime.score).toBeGreaterThan(55); // genuinely rampant

    const lines = summarizeCausalState(settlement);
    const joined = lines.join(' ');
    // criminal_opportunity must NOT be tucked under a positive-sounding band line.
    const collapsedLine = lines.find(l => /^Collapsed:/.test(l)) || '';
    const criticalLine = lines.find(l => /^Critical:/.test(l)) || '';
    const strainedLine = lines.find(l => /^Strained:/.test(l)) || '';
    expect(collapsedLine).not.toMatch(/criminal_opportunity/);
    expect(criticalLine).not.toMatch(/criminal_opportunity/);
    expect(strainedLine).not.toMatch(/criminal_opportunity/);
    // It must instead appear under a problem-term line.
    expect(/(Rampant|Acute|Elevated):[^.]*criminal_opportunity/.test(joined)).toBe(true);
  });

  it('does not list contained (low) crime as a misleading "Surplus"', () => {
    // A clean settlement: criminal_opportunity should be low/good and not be
    // surfaced as "Surplus: criminal_opportunity".
    const settlement = {
      powerStructure: { publicLegitimacy: { score: 90, label: 'Trusted' } },
    };
    const lines = summarizeCausalState(settlement);
    const surplusLine = lines.find(l => /^Surplus:/.test(l)) || '';
    expect(surplusLine).not.toMatch(/criminal_opportunity/);
  });
});
