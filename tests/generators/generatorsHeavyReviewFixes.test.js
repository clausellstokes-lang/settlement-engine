/**
 * tests/generators/generatorsHeavyReviewFixes.test.js — B09 review-bundle pins.
 *
 * Covers the heavy-generator review fixes:
 *   1. The placeholder token "SEVERITY" must never ship inside a user-facing
 *      quoted string in either heavy generator (it leaked into the lawless
 *      "No law, bring coin" criminal service description).
 *   2/3. The confirmed-dead near-duplicate helpers (servicesGenerator's narrative
 *      block + economicGenerator's _computeIncomeStreams / getHistoryModifiers /
 *      _getUpgradeOpps / _generateTradeScore) are deleted, not just renamed.
 *   4. INSTITUTION_FINISHED_GOODS_DEMAND no longer double-counts a single
 *      institution that contains overlapping substring keys (longest-match-wins).
 *   8. TIER_ORDER is the imported canonical constant — no shadowing local copy.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { generateEconomicState } from '../../src/generators/economicGenerator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../../src/generators');
const economicSrc = readFileSync(resolve(SRC, 'economicGenerator.js'), 'utf8');
const servicesSrc = readFileSync(resolve(SRC, 'servicesGenerator.js'), 'utf8');

// Strip line/block comments so static source assertions inspect real CODE only
// (the deletion left an explanatory comment that names the removed helpers).
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const econCode = stripComments(economicSrc);
const svcCode = stripComments(servicesSrc);

function ecoStateWithSeed(tier, institutions, route, config) {
  setActiveRng(createPRNG('b09-fixtures'));
  try {
    return generateEconomicState(tier, institutions, route, {}, { tier, tradeRouteAccess: route, nearbyResources: [], ...config });
  } finally {
    clearActiveRng();
  }
}

describe('finding 1 — no leaked "SEVERITY" token in user-facing strings', () => {
  // The token must not appear inside a quoted string literal (single, double,
  // or template) on a single source line. economicGenerator legitimately uses
  // the imported SEVERITY enum (SEVERITY.CRITICAL etc.) — those are bare
  // identifiers, never quoted. The inner class excludes newlines and quote
  // chars so a match is genuinely one string literal, not a span across code.
  const quotedSeverity = /(['"`])[^'"`\n]*\bSEVERITY\b[^'"`\n]*\1/;

  it('servicesGenerator ships no quoted SEVERITY token', () => {
    expect(quotedSeverity.test(svcCode)).toBe(false);
  });

  it('economicGenerator ships no quoted SEVERITY token', () => {
    expect(quotedSeverity.test(econCode)).toBe(false);
  });

  it('the live lawless criminal description reads cleanly', () => {
    // It must still describe the lawless market — just without the raw token.
    expect(servicesSrc).toContain('apply more violence or pay more for it.');
    expect(servicesSrc).not.toContain('pay more for SEVERITY');
  });
});

describe('findings 2 & 3 — confirmed-dead duplicate helpers are deleted', () => {
  const deadDecl = (name) => new RegExp(`(?:const|let|function)\\s+${name}\\b`);

  it.each([
    '_getTierConstraints',
    '_getCategoryDisplay',
    'CATEGORY_COLORS',
    '_UPGRADE_CHAINS',
  ])('servicesGenerator no longer declares %s', (name) => {
    expect(deadDecl(name).test(svcCode)).toBe(false);
  });

  it.each([
    '_computeIncomeStreams',
    'getHistoryModifiers',
    '_getUpgradeOpps',
    '_generateTradeScore',
  ])('economicGenerator no longer declares %s', (name) => {
    expect(deadDecl(name).test(econCode)).toBe(false);
  });

  it('keeps the single live income/upgrade sources of truth', () => {
    expect(/const\s+generateTradeIncomeStreams\b/.test(econCode)).toBe(true);
    expect(/const\s+getGoodsModifiers\b/.test(econCode)).toBe(true);
    expect(/getUpgradeOpportunities\b/.test(econCode)).toBe(true);
  });
});

describe('finding 8 — TIER_ORDER is the imported canonical constant', () => {
  it('imports TIER_ORDER and never redefines it locally', () => {
    expect(/import\s*\{[^}]*\bTIER_ORDER\b[^}]*\}\s*from\s*['"]\.\.\/data\/constants\.js['"]/.test(econCode)).toBe(true);
    // No local array shadow (the two former `const TIER_ORDER[_LOCAL] = [...]`).
    expect(/const\s+TIER_ORDER(_LOCAL)?\s*=\s*\[/.test(econCode)).toBe(false);
  });
});

describe('finding 4 — finished-goods demand does not double-count overlapping keys', () => {
  it('demand side: "Parish churches (2-5)" counts religious demand once (=2), not 3', () => {
    // demand=2 → smallest import label (label[0]); the buggy double-count
    // (parish church + parish churches (2-5) = 3) would escalate to label[1].
    const res = ecoStateWithSeed('village', [{ name: 'Parish churches (2-5)' }], 'road');
    expect(res.primaryImports).toContain('Incense and votive candles');
    expect(res.primaryImports).not.toContain('Incense, ritual oil, and vestment materials');
  });

  it('supply side: "Blacksmiths (3-10)" counts arms supply once (=3), not 5', () => {
    // Garrison demand=4 vs blacksmiths supply=3 → gap 1 → an arms import surfaces.
    // The buggy double-count (blacksmith + blacksmiths (3-10) = 5) would cover
    // the demand entirely (gap -1) and emit no arms import at all.
    const res = ecoStateWithSeed('town', [{ name: 'Garrison' }, { name: 'Blacksmiths (3-10)' }], 'road');
    expect(res.primaryImports).toContain('Replacement arms and basic equipment');
  });

  it('different institutions still sum additively (no over-correction)', () => {
    // A blacksmith (supply 2) + a smelter (supply 1, additive) are distinct
    // institutions, so they must still combine — longest-match-wins is per
    // institution, not global. Garrison demand 4 vs supply 3 → arms import.
    const res = ecoStateWithSeed('town', [{ name: 'Garrison' }, { name: 'Blacksmith' }, { name: 'Smelter' }], 'road');
    expect(res.primaryImports).toContain('Replacement arms and basic equipment');
  });
});
