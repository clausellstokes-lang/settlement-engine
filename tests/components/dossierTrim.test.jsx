/** @vitest-environment jsdom */
/**
 * dossierTrim.test.jsx — THE TRIM OF 2026-11-01 (the owner; ODQ §934.103).
 *
 * Two cuts of chrome that re-announced nothing (rubric R4, R6), each asserted on the same
 * render as a presence that anchors it:
 *   - Relationships offers no filter with nothing behind it;
 *   - Plot Hooks names a source once over all of its hooks.
 * (Power's zero-value modifiers are pinned beside their fixture in powerTabSupport; the
 * Foundations sentence beside the grid in dossierDepthTabs; its print twin in
 * restoredSubsections; the Overview's identity row in overviewIdentityRow.)
 */
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen, within } from '@testing-library/react';
import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';
import PlotHooksTab, { groupHooksBySource } from '../../src/components/new/tabs/PlotHooksTab.jsx';

afterEach(() => cleanup());

describe('Relationships — a filter with nothing behind it is not offered', () => {
  const town = () => ({
    _seed: 'trim-rels', id: 'trim-rels', name: 'Homestead',
    npcs: [
      { id: 'a', name: 'Mugain', role: 'Clerk', category: 'economy' },
      { id: 'b', name: 'Odo', role: 'Smith', category: 'economy' },
    ],
    relationships: [
      { npc1Name: 'Mugain', npc2Name: 'Odo', type: 'rival', typeName: 'Rivalry', npc1Role: 'Clerk', npc2Role: 'Smith', strength: 'strong', description: 'They split the market.' },
      { npc1Name: 'Odo', npc2Name: 'Mugain', type: 'ally', typeName: 'Alliance', npc1Role: 'Smith', npc2Role: 'Clerk', strength: 'weak', description: 'They drink together.' },
    ],
  });
  it('offers All and the kinds present, and no empty kind', () => {
    render(<RelationshipsTab settlement={town()} />);
    expect(screen.getByRole('button', { name: 'All (2)' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Rivals (1)' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Allies (1)' })).toBeTruthy();
    // anchored: the three live chips are asserted above on this render
    expect(screen.queryByRole('button', { name: /Patronage/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Leverage/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Enemies/ })).toBeNull();
  });
});

describe('Plot Hooks — a source is named once over all of its hooks', () => {
  const town = {
    name: 'Xindao',
    npcs: [
      { name: 'Fenghua Guo', role: 'Mayor', plotHooks: ['They have been meeting privately with someone from outside the settlement.', 'Someone who publicly supports them is being paid by someone who opposes them.'] },
      { name: 'Zhen Li', role: 'Guard Captain', plotHooks: ['A recruit they turned away has since joined a different outfit.'] },
    ],
  };
  it('groups by source in order of first appearance, merging non-adjacent repeats', () => {
    const groups = groupHooksBySource([
      { source: 'A', text: '1' }, { source: 'B', text: '2' }, { source: 'A', text: '3' },
    ]);
    expect(groups.map(g => [g.source, g.hooks.map(h => h.text)])).toEqual([['A', ['1', '3']], ['B', ['2']]]);
  });
  it('renders one source card with every hook under the name, and a single card for a single hook', () => {
    const { container } = render(<PlotHooksTab settlement={town} />);
    const section = screen.getByTestId('plot-hooks-from-npcs');
    const sourceCards = within(section).getAllByTestId('plot-hook-source-card');
    expect(sourceCards).toHaveLength(1);
    expect(within(sourceCards[0]).getAllByTestId('plot-hook-line')).toHaveLength(2);
    expect(within(section).getAllByTestId('plot-hook-card')).toHaveLength(1);
    // the name prints once on the page, over both of its hooks
    expect(container.textContent.split('Fenghua Guo').length - 1).toBe(1);
    expect(container.textContent).toContain('meeting privately');
    expect(container.textContent).toContain('publicly supports');
  });
});
