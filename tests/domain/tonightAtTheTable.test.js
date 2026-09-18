/**
 * tonightAtTheTable.test.js — Contract over the magazine-spread
 * right-column composer.
 *
 * Pins the picker against REAL generator shapes (the previous version of
 * this test pinned phantom fields — npc.importance, settlement.plotHooks
 * with .tier, legacyAnnotations.title/.body, supplyChainState.failures —
 * none of which any generator emits, so every card silently degraded).
 */

import { describe, it, expect } from 'vitest';
import { tonightAtTheTable } from '../../src/domain/summary/tonightAtTheTable.js';

describe('tonightAtTheTable', () => {
  it('null/empty input → empty array', () => {
    expect(tonightAtTheTable(null)).toEqual([]);
    expect(tonightAtTheTable({})).toEqual([]);
  });

  it('promotes high-power NPCs ahead of low-power ones', () => {
    const set = {
      npcs: [
        { name: 'Alice', power: 2, role: 'farmer' },
        { name: 'Velda', power: 9, role: 'captain', secret: { what: 'corrupt' } },
      ],
    };
    const out = tonightAtTheTable(set);
    expect(out[0].kind).toBe('NPC');
    expect(out[0].title).toBe('Velda');
  });

  it('renders an object-shaped NPC secret via .what (no [object Object])', () => {
    const set = {
      npcs: [
        { name: 'A', power: 9, role: 'captain', secret: { what: 'skimming the wall-fund', stakes: 'exile' } },
      ],
    };
    const out = tonightAtTheTable(set);
    expect(out[0].body).toContain('skimming the wall-fund');
    expect(out[0].body).not.toContain('[object Object]');
  });

  it('falls back to goal.short when there is no secret', () => {
    const set = {
      npcs: [{ name: 'A', power: 5, role: 'mayor', goal: { short: 'consolidate the council' } }],
    };
    const out = tonightAtTheTable(set);
    expect(out[0].body).toContain('consolidate the council');
  });

  it('higher-priority plot hooks win', () => {
    const set = {
      npcs: [
        { name: 'Low', power: 1, influence: 'low', plotHooks: ['A quiet rumor'] },
        { name: 'High', power: 9, influence: 'high', plotHooks: ['The vault was emptied last night'] },
      ],
    };
    const out = tonightAtTheTable(set);
    const hookEntries = out.filter(e => e.kind === 'HOOK');
    expect(hookEntries.length).toBeGreaterThan(0);
    expect(hookEntries[0].body).toContain('vault was emptied');
  });

  it('legacyAnnotation feeds the TWIST entry (eventName + annotation)', () => {
    const set = {
      history: { legacyAnnotations: [{ eventName: 'The hidden lever', annotation: 'an old debt resurfaces' }] },
    };
    const out = tonightAtTheTable(set);
    const twist = out.find(e => e.kind === 'TWIST');
    expect(twist?.title).toBe('The hidden lever');
    expect(twist?.body).toContain('old debt');
  });

  it('TWIST falls back to a third NPC secret when no legacy annotation', () => {
    const set = {
      npcs: [
        { name: 'A', power: 9, role: 'a' },
        { name: 'B', power: 8, role: 'b' },
        { name: 'C', power: 7, role: 'c', secret: { what: 'a hidden thing' } },
      ],
    };
    const out = tonightAtTheTable(set);
    const twist = out.find(e => e.kind === 'TWIST');
    expect(twist?.title).toBe('C');
    expect(twist?.body).toContain('hidden thing');
  });

  it('a disrupted supply chain produces a RED don\'t-mention entry', () => {
    const set = {
      economicState: {
        activeChains: [
          { chainId: 'salt', needLabel: 'Salt', status: 'blocked' },
        ],
      },
    };
    const out = tonightAtTheTable(set);
    const red = out.find(e => e.kind === 'RED');
    expect(red?.title).toBe("Don't mention Salt");
    expect(red?.body).toContain('NPCs go cold');
  });

  it('caps total entries at 6', () => {
    const set = {
      npcs: Array.from({ length: 8 }, (_, i) => ({
        name: `N${i}`, power: 9 - i, role: 'r', secret: { what: 's' },
        plotHooks: [`hook ${i}`],
      })),
      history: { legacyAnnotations: [{ eventName: 'T', annotation: 'b' }] },
      economicState: { activeChains: [{ chainId: 'g', needLabel: 'g', status: 'collapsing' }] },
    };
    expect(tonightAtTheTable(set).length).toBeLessThanOrEqual(6);
  });

  // ── NO BODY IS CLIPPED (2026-09-18) ───────────────────────────────────────
  // Every body used to pass through a blind character slice: 80 for an NPC's
  // secret or want, 120 for a hook, a twist and an annotation, 160 for the red
  // flag. The cut ignored word boundaries, so a cheat sheet a DM reads aloud
  // mid-sentence ended in "…selling the gra…" with the rest nowhere on the
  // surface. The cards carry the whole thought; the surfaces scroll.
  it('carries a long hook whole — no ellipsis, nothing lost', () => {
    const text = 'The vault was emptied last night and the only key hangs on the reeve\'s own belt, '
      + 'which is why the watch has spent the morning questioning everyone except the reeve.';
    const set = {
      npcs: [{ name: 'X', power: 9, role: 'r', plotHooks: [text] }],
    };
    const out = tonightAtTheTable(set);
    const hook = out.find(e => e.kind === 'HOOK');
    expect(hook.body).toBe(text);
    expect(hook.body.endsWith('…')).toBe(false);
  });

  it('no row of a long settlement ends in an ellipsis', () => {
    const long = (lead) => `${lead} ${'and the debt is older than anyone still drawing breath in this valley '.repeat(4)}`.trim();
    const set = {
      npcs: [
        { name: 'A', power: 9, role: 'reeve', secret: { what: long('Skims the tithe') }, plotHooks: [long('A midnight muster')] },
        { name: 'B', power: 8, role: 'factor', goal: { short: long('Corner the grain trade') } },
        { name: 'C', power: 7, role: 'clerk', secret: { what: long('Forged the charter') } },
      ],
      history: { legacyAnnotations: [{ eventName: 'The hidden lever', annotation: long('An old debt resurfaces') }] },
      economicState: {
        activeChains: [{
          chainId: 'salt', needLabel: 'Salt', status: 'blocked',
          failureConsequences: long('The pans have stood empty since the spring floods'),
        }],
      },
    };
    const out = tonightAtTheTable(set);
    expect(out.length).toBeGreaterThan(0);
    for (const row of out) {
      expect(row.body.endsWith('…'), `${row.kind} body was clipped: ${row.body}`).toBe(false);
    }
  });
});
