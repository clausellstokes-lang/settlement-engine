/**
 * compendiumSearch.test.js — contract over P139 / CP-4 global search.
 *
 * Pins:
 *   • empty / whitespace query → no results
 *   • exact term match ranks first
 *   • prefix + word-boundary + substring + keyword matching all work
 *   • case-insensitivity
 *   • multi-word queries resolve (exact term + out-of-order tokens)
 *   • limit is honored
 *   • every result is a valid navigation target (known tab + anchor)
 *   • index integrity (unique ids, valid tabs)
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  searchCompendium,
  COMPENDIUM_INDEX,
  COMPENDIUM_TABS,
} from '../../src/domain/compendium/searchIndex.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('searchCompendium', () => {
  it('returns [] for empty or whitespace queries', () => {
    expect(searchCompendium('')).toEqual([]);
    expect(searchCompendium('   ')).toEqual([]);
    expect(searchCompendium(null)).toEqual([]);
    expect(searchCompendium(undefined)).toEqual([]);
  });

  it('ranks an exact term match first', () => {
    const res = searchCompendium('Theocracy');
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].term).toBe('Theocracy');
    expect(res[0].tab).toBe('power');
  });

  it('is case-insensitive', () => {
    const lower = searchCompendium('theocracy');
    const upper = searchCompendium('THEOCRACY');
    expect(lower[0].term).toBe('Theocracy');
    expect(upper[0].term).toBe('Theocracy');
  });

  it('matches by prefix and ranks the shortest (most specific) term first', () => {
    const res = searchCompendium('theo');
    const terms = res.map(r => r.term);
    expect(terms).toContain('Theocracy');
    expect(terms).toContain('Theocratic Economy');
    // shortest term among equal-scoring prefix hits leads
    expect(res[0].term).toBe('Theocracy');
  });

  it('matches multi-word terms exactly', () => {
    const res = searchCompendium('mage city');
    expect(res[0].term).toBe('Mage City');
    expect(res[0].tab).toBe('power');
  });

  it('matches relationship types from the shared data', () => {
    const res = searchCompendium('cold war');
    expect(res[0].term).toBe('Cold War');
    expect(res[0].tab).toBe('neighbour');
  });

  it('matches tiers, routes and threats on the tiers tab', () => {
    expect(searchCompendium('metropolis')[0].term).toBe('Metropolis');
    expect(searchCompendium('port')[0].term).toBe('Port');
    const frontier = searchCompendium('frontier').map(r => r.term);
    expect(frontier).toContain('Frontier');
  });

  it('matches on keyword text, not just the term', () => {
    // "siege" is the Siege stress term AND lives in Besieged Holdout's keywords
    const res = searchCompendium('siege');
    const terms = res.map(r => r.term);
    expect(res[0].term).toBe('Siege');
    expect(terms).toContain('Besieged Holdout');
  });

  it('honors the limit option', () => {
    const res = searchCompendium('a', { limit: 3 });
    expect(res.length).toBeLessThanOrEqual(3);
  });

  it('every result is a valid navigation target', () => {
    const res = searchCompendium('magic', { limit: 20 });
    expect(res.length).toBeGreaterThan(0);
    for (const r of res) {
      expect(COMPENDIUM_TABS).toContain(r.tab);
      expect(typeof r.anchor).toBe('string');
      expect(r.anchor.length).toBeGreaterThan(0);
      expect(typeof r.term).toBe('string');
      expect(typeof r.id).toBe('string');
    }
  });
});

describe('COMPENDIUM_INDEX integrity', () => {
  it('has unique entry ids', () => {
    const ids = COMPENDIUM_INDEX.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only references known tabs', () => {
    for (const e of COMPENDIUM_INDEX) {
      expect(COMPENDIUM_TABS).toContain(e.tab);
    }
  });

  it('includes all 30 archetypes', () => {
    const archetypes = COMPENDIUM_INDEX.filter(e => e.category === 'Archetype');
    expect(archetypes.length).toBe(30);
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(COMPENDIUM_INDEX)).toBe(true);
    expect(Object.isFrozen(COMPENDIUM_INDEX[0])).toBe(true);
  });
});

// ── COMPENDIUM_TABS ⇔ CompendiumPanel parity (domain-region-dossier-guidance-5) ──
describe('COMPENDIUM_TABS stays in lockstep with the CompendiumPanel TABS', () => {
  // The index's valid-destination set drifted from the panel (the Living World tab was
  // in the panel but absent here, so the global search could never route to it). This
  // pins the two together. Source-scans the panel's TABS block for its `id:'…'` values
  // — JUDGMENT (vetoable): a source scan rather than importing CompendiumPanel.jsx,
  // which would drag React + lucide + every lazy tab module into this pure-node domain
  // test; a new/renamed panel tab id still reds this until COMPENDIUM_TABS matches.
  function panelTabIds() {
    const src = readFileSync(join(ROOT, 'src/components/CompendiumPanel.jsx'), 'utf8');
    const block = src.match(/const TABS\s*=\s*\[([\s\S]*?)\];/);
    expect(block, 'could not locate the TABS array in CompendiumPanel.jsx').toBeTruthy();
    return [...block[1].matchAll(/\bid\s*:\s*['"]([a-z0-9_-]+)['"]/g)].map((m) => m[1]);
  }

  it('the panel TABS ids and COMPENDIUM_TABS are the same set (both directions)', () => {
    const panel = panelTabIds();
    expect(panel.length).toBeGreaterThan(0);
    expect([...COMPENDIUM_TABS].sort()).toEqual([...new Set(panel)].sort());
  });

  it('the Living World tab is present and searchable (the drift the finding named)', () => {
    expect(COMPENDIUM_TABS).toContain('living');
    const living = COMPENDIUM_INDEX.filter((e) => e.tab === 'living');
    expect(living.length).toBeGreaterThan(0);
    // "war" resolves to a Living World destination among its results.
    const res = searchCompendium('living pantheon');
    expect(res.some((r) => r.tab === 'living')).toBe(true);
  });
});
