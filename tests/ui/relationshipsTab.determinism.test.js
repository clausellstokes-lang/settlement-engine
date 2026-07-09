/**
 * @vitest-environment jsdom
 *
 * F10 render-stability pin for RelationshipsTab.
 *
 * The tab derives "live" cross-settlement conflicts for an unsaved settlement
 * (one with a generator `neighborRelationship` but no persisted link). That
 * derivation used to draw from Math.random at RENDER TIME, so the visible
 * "Cross-Settlement Engagements" changed on every mount/remount and could never
 * match an export — the worst determinism violation in the product. It now goes
 * through the identity-seeded deterministic wrapper, so two independent mounts of
 * the same settlement render byte-identical conflict text.
 *
 * createElement (not JSX) + a .js file: test files don't get the JSX transform
 * here (see tabs.smoke.test.js). Named export = the unmemoized component, so each
 * render re-runs the derivation (React.memo would short-circuit it).
 */
import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';

const e = React.createElement;
afterEach(() => cleanup());

// An unsaved settlement with a rival neighbour, both sides carrying
// matching-category NPCs and factions so the live derivation emits conflicts.
function makeSettlement() {
  const npcs = (p) => ([
    { id: `${p}_e`, name: `${p} Merchant`, role: 'Trader', category: 'economy' },
    { id: `${p}_m`, name: `${p} Captain`, role: 'Officer', category: 'military' },
    { id: `${p}_c`, name: `${p} Fixer`, role: 'Broker', category: 'criminal' },
  ]);
  return {
    _seed: 'seed-home',
    id: 'id-home',
    name: 'Homestead',
    npcs: npcs('H'),
    factions: [{ name: 'H Guild', dominantCategory: 'economy' }],
    neighborRelationship: {
      name: 'Rivalton',
      tier: 'town',
      relationshipType: 'rival',
      npcs: npcs('N'),
      factions: [{ name: 'N Guild', dominantCategory: 'economy' }],
    },
  };
}

describe('RelationshipsTab — live conflict determinism (F10)', () => {
  test('two independent mounts render identical Cross-Settlement Engagements', () => {
    const first = render(e(RelationshipsTab, { settlement: makeSettlement() }));
    const firstText = first.container.textContent;
    cleanup();
    const second = render(e(RelationshipsTab, { settlement: makeSettlement() }));
    const secondText = second.container.textContent;

    // Real content was produced (not the trivially-equal empty case).
    expect(firstText).toContain('Cross-Settlement Engagements');
    // Same seed identity ⇒ same rendered dossier, every mount.
    expect(secondText).toBe(firstText);
  });
});
