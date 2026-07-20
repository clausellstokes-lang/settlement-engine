/**
 * seoCompendium.test.js — the per-entry Compendium head builder (V-19 long tail).
 *
 * Pins the PURE builder both the prerender and the SPA consume, so the baked head
 * and the runtime head cannot disagree about a named entry's title, canonical,
 * or DefinedTerm structured data.
 */
import { describe, it, expect } from 'vitest';
import { compendiumEntryHead, compendiumEntryPath } from '../../src/lib/seoCompendium.js';
import { COMPENDIUM_INDEX } from '../../src/domain/compendium/searchIndex.js';

describe('compendiumEntryHead', () => {
  const entry = { id: 'tier-thorp', term: 'Thorp', category: 'Tier', tab: 'tiers', anchor: 'tiers', keywords: 'smallest' };

  it('builds the entry title, description, canonical, and a DefinedTerm graph', () => {
    const h = compendiumEntryHead(entry);
    expect(h.title).toBe('Thorp · SettlementForge Compendium');
    expect(h.description).toContain('Thorp');
    expect(h.description).toContain('tier'); // the category, lowercased
    expect(h.canonical).toBe('https://settlementforge.com/compendium/tier-thorp');
    expect(h.ogType).toBe('article');
    expect(h.jsonLd['@type']).toBe('DefinedTerm');
    expect(h.jsonLd.name).toBe('Thorp');
    expect(h.jsonLd.termCode).toBe('tier-thorp');
    expect(h.jsonLd.url).toBe(h.canonical);
    expect(h.jsonLd.inDefinedTermSet['@type']).toBe('DefinedTermSet');
    expect(h.jsonLd.inDefinedTermSet.url).toBe('https://settlementforge.com/compendium');
  });

  it('the house voice holds: no em dash in the authored copy', () => {
    for (const e of COMPENDIUM_INDEX.slice(0, 40)) {
      expect(compendiumEntryHead(e).description).not.toContain('—');
    }
  });

  it('encodes the entry id in the path', () => {
    expect(compendiumEntryPath('arch-plague-of-beasts')).toBe('/compendium/arch-plague-of-beasts');
  });

  it('every committed index entry yields a valid, unique canonical', () => {
    const seen = new Set();
    for (const e of COMPENDIUM_INDEX) {
      const h = compendiumEntryHead(e);
      expect(h.canonical.startsWith('https://settlementforge.com/compendium/')).toBe(true);
      expect(seen.has(h.canonical), `duplicate canonical ${h.canonical}`).toBe(false);
      seen.add(h.canonical);
      expect(h.title.length).toBeGreaterThan(0);
    }
    expect(seen.size).toBe(COMPENDIUM_INDEX.length);
  });
});
