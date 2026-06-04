/**
 * tonightAtTheTable.test.js - Contract over the magazine-spread
 * right-column composer.
 *
 * Pinning the picker so a future refactor (rebalancing thresholds,
 * adding a new entry kind) can't silently drift what the DM sees
 * when they open the Summary tab.
 */

import { describe, it, expect } from 'vitest';
import { tonightAtTheTable } from '../../src/domain/summary/tonightAtTheTable.js';

describe('tonightAtTheTable', () => {
  it('null/empty input → empty array', () => {
    expect(tonightAtTheTable(null)).toEqual([]);
    expect(tonightAtTheTable({})).toEqual([]);
  });

  it('promotes major NPCs ahead of minor ones', () => {
    const set = {
      npcs: [
        { name: 'Alice',   importance: 'minor',  role: 'farmer' },
        { name: 'Velda',   importance: 'major',  role: 'captain', secret: 'corrupt' },
      ],
    };
    const out = tonightAtTheTable(set);
    expect(out[0].kind).toBe('NPC');
    expect(out[0].title).toBe('Velda');
  });

  it('uses secret > want > role for the body', () => {
    const set = {
      npcs: [
        { name: 'A', importance: 'major', role: 'captain', secret: 'skimming the wall-fund' },
      ],
    };
    const out = tonightAtTheTable(set);
    expect(out[0].body).toContain('skimming the wall-fund');
  });

  it('Tier-A hook beats Tier-C', () => {
    const set = {
      plotHooks: [
        { tier: 'C', title: 'Low-tier', body: 'low' },
        { tier: 'A', title: 'Top-tier', body: 'top' },
      ],
    };
    const out = tonightAtTheTable(set);
    const hookEntries = out.filter(e => e.kind === 'HOOK');
    expect(hookEntries[0].title).toBe('Top-tier');
  });

  it('legacyAnnotation feeds the TWIST entry', () => {
    const set = {
      history: { legacyAnnotations: [{ title: 'The hidden lever', body: 'an old debt' }] },
    };
    const out = tonightAtTheTable(set);
    expect(out.find(e => e.kind === 'TWIST').title).toBe('The hidden lever');
  });

  it('TWIST falls back to a major NPC secret when no legacy annotation', () => {
    const set = {
      npcs: [
        { name: 'A', importance: 'major', role: 'a' },
        { name: 'B', importance: 'major', role: 'b' },
        { name: 'C', importance: 'major', role: 'c', secret: 'a hidden thing' },
      ],
    };
    const out = tonightAtTheTable(set);
    const twist = out.find(e => e.kind === 'TWIST');
    expect(twist?.title).toBe('C');
    expect(twist?.body).toContain('hidden thing');
  });

  it('failing supply chain produces a RED don\'t-mention entry', () => {
    const set = {
      supplyChainState: {
        failures: [{ good: 'salt', reason: 'routes broken' }],
      },
    };
    const out = tonightAtTheTable(set);
    const red = out.find(e => e.kind === 'RED');
    expect(red?.title).toBe("Don't mention salt");
    expect(red?.body).toContain('routes broken');
  });

  it('caps total entries at 6', () => {
    const set = {
      npcs: Array.from({ length: 8 }, (_, i) => ({
        name: `N${i}`, importance: 'major', role: 'r', secret: 's',
      })),
      plotHooks: Array.from({ length: 8 }, (_, i) => ({
        tier: 'A', title: `H${i}`, body: 'b',
      })),
      history: { legacyAnnotations: [{ title: 'T', body: 'b' }] },
      supplyChainState: { failures: [{ good: 'g', reason: 'r' }] },
    };
    expect(tonightAtTheTable(set).length).toBeLessThanOrEqual(6);
  });

  it('long bodies get truncated with an ellipsis', () => {
    const set = {
      plotHooks: [
        { tier: 'A', title: 'X', body: 'a'.repeat(200) },
      ],
    };
    const out = tonightAtTheTable(set);
    expect(out[0].body.length).toBeLessThanOrEqual(120);
    expect(out[0].body.endsWith('...')).toBe(true);
  });
});
