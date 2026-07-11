/**
 * deityPool.test.js — governance pins for the core deity pool (Phase 4 W-F5).
 *
 * The pool is CONTENT under engine law: every entry must validate like an
 * authored deity (portfolio included), its stored temperamentAxis must MIRROR
 * the live derivation exactly (the decoupled-temper fixture class that stage 1
 * retired can never re-enter through shipped content), refs must live in the
 * stable `deity:core:` namespace, and the affinity tags must stay inside the
 * vocabularies the generation step actually matches.
 */

import { describe, expect, test } from 'vitest';

import { DEITY_POOL, DEITY_CORE_REF_PREFIX, deityCoreRef } from '../../src/generators/data/deityPool.js';
import { deriveTemper, evil01, chaos01 } from '../../src/domain/worldPulse/deityAxes.js';
import { nicheOf } from '../../src/domain/worldPulse/cultImpositionApply.js';
import {
  validateDeity, DEITY_ALIGNMENT_KEYS, DEITY_LAW_KEYS, DEITY_TIER_KEYS, DEITY_PORTFOLIO_MAX_LENGTH,
} from '../../src/domain/customContentSchema.js';

const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
const CULTURES = ['germanic', 'celtic', 'norse', 'mediterranean'];
const GOV_CLASSES = ['theocratic', 'martial', 'monarchic', 'civic'];

describe('deityPool — governed content pins', () => {
  test('every entry validates as an authored deity (portfolio included)', () => {
    for (const d of DEITY_POOL) {
      const { ok, errors } = validateDeity(d);
      expect(errors, `${d.slug}: ${errors.join(' | ')}`).toEqual([]);
      expect(ok).toBe(true);
      expect(typeof d.portfolio).toBe('string');
      expect(d.portfolio.length).toBeGreaterThan(0);
      expect(d.portfolio.length).toBeLessThanOrEqual(DEITY_PORTFOLIO_MAX_LENGTH);
    }
  });

  test('stored temperamentAxis MIRRORS the derivation for every entry (no decoupled temper can ship)', () => {
    for (const d of DEITY_POOL) {
      expect(d.temperamentAxis, d.slug).toBe(deriveTemper(evil01(d), chaos01(d)));
    }
  });

  test('slugs are unique, kebab-lowercase, and refs mint in the deity:core: namespace', () => {
    const slugs = DEITY_POOL.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) {
      expect(s).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(deityCoreRef(s)).toBe(`${DEITY_CORE_REF_PREFIX}${s}`);
    }
  });

  test('the pool spans the full alignment × law plane and all three ranks', () => {
    const cells = new Set(DEITY_POOL.map((d) => `${d.alignmentAxis}:${d.lawAxis}`));
    for (const a of DEITY_ALIGNMENT_KEYS) for (const l of DEITY_LAW_KEYS) {
      expect(cells.has(`${a}:${l}`), `missing plane cell ${a}:${l}`).toBe(true);
    }
    const ranks = new Set(DEITY_POOL.map((d) => d.rankAxis));
    for (const r of DEITY_TIER_KEYS) expect(ranks.has(r), `missing rank ${r}`).toBe(true);
    // Derived-niche coverage: all three derived niches are drawable for both the
    // patron lane (major/minor) and the cult lane (minor/cult).
    const patronNiches = new Set(DEITY_POOL.filter((d) => d.rankAxis !== 'cult').map(nicheOf));
    const cultNiches = new Set(DEITY_POOL.filter((d) => d.rankAxis !== 'major').map(nicheOf));
    for (const n of ['peacelike:good', 'neutral:neutral', 'warlike:evil']) {
      expect(patronNiches.has(n), `patron lane missing niche ${n}`).toBe(true);
      expect(cultNiches.has(n), `cult lane missing niche ${n}`).toBe(true);
    }
  });

  test('affinity tags stay inside the matched vocabularies', () => {
    for (const d of DEITY_POOL) {
      for (const t of d.affinity.terrain) expect(TERRAINS, `${d.slug} terrain ${t}`).toContain(t);
      for (const c of d.affinity.culture) expect(CULTURES, `${d.slug} culture ${c}`).toContain(c);
      for (const g of d.affinity.government) expect(GOV_CLASSES, `${d.slug} government ${g}`).toContain(g);
    }
  });

  test('portfolio validation is additive-tolerant (absent fine, bad type/oversize rejected)', () => {
    const base = { name: 'X', alignmentAxis: 'good', temperamentAxis: 'peacelike', rankAxis: 'minor', lawAxis: 'lawful' };
    expect(validateDeity(base).ok).toBe(true);                                  // absent ⇒ tolerated
    expect(validateDeity({ ...base, portfolio: 'Wine and honest scales.' }).ok).toBe(true);
    expect(validateDeity({ ...base, portfolio: 42 }).ok).toBe(false);           // non-string rejected
    expect(validateDeity({ ...base, portfolio: 'x'.repeat(DEITY_PORTFOLIO_MAX_LENGTH + 1) }).ok).toBe(false);
  });
});
