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
import { render, cleanup, fireEvent } from '@testing-library/react';
import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

/**
 * THE CONSOLIDATED PAGE (chair rulings X-2, X-6, R2-R8, 2026-10-30). One page: the
 * neighbours half and the internal half render together whatever route mounts it; each
 * cross-settlement row prints once (its own section, never again inside the neighbour
 * card); the explainer intros and the slider sentence are gone; the conflict head carries
 * the issue, the template sentence and the conflict's plot hooks are gone.
 */
describe('RelationshipsTab — the consolidated page', () => {
  const CONTACT = 'Mugain keeps a standing line to Felix across the river.';
  const ENGAGE = 'Two houses, one quarrel.';
  const DESC = 'The Guild and The Wardens are in high conflict over control of the toll bridge. The stakes are commercial supremacy.';
  const HOOK = 'A toll-keeper offers the party a ledger that ruins one side.';
  const LEGACY = 'An old letter-friendship between the two clerks.';
  const town = () => ({
    _seed: 'seed-cons', id: 'id-cons', name: 'Steinmark',
    npcs: [{ id: 'm', name: 'Mugain', role: 'Clerk' }, { id: 'o', name: 'Odo', role: 'Smith' }],
    neighbourNetwork: [{
      id: 'n1', linkId: 'L1', name: 'Thornmere', neighbourName: 'Thornmere', neighbourTier: 'town',
      relationshipType: 'rival', sharedHistory: 'A bridge both claim.',
      npcConnections: [{ primaryNPCName: 'Mugain', neighbourNPCName: 'Felix', description: LEGACY }],
    }],
    interSettlementRelationships: [
      { npcName: 'Mugain', npcRole: 'Clerk', partnerName: 'Felix', partnerRole: 'Reeve', partnerSettlement: 'Thornmere', relType: 'rival', description: CONTACT, linkId: 'L1' },
      { type: 'faction_engagement', factionName: 'The Guild', partnerFactionName: 'The Wardens', partnerSettlement: 'Thornmere', relType: 'rival', description: ENGAGE, linkId: 'L1' },
    ],
    relationships: [
      { npc1Name: 'Mugain', npc2Name: 'Odo', type: 'rival', typeName: 'Rivalry', npc1Role: 'Clerk', npc2Role: 'Smith', strength: 'strong', description: 'They split the market.', flagDriven: true },
      { npc1Name: 'Odo', npc2Name: 'Mugain', type: 'ally', typeName: 'Alliance', npc1Role: 'Smith', npc2Role: 'Clerk', strength: 'weak', description: 'They drink together.', flagDriven: true },
    ],
    factions: [{ name: 'The Guild', dominantCategory: 'economy', members: [{ id: 'm', name: 'Mugain', role: 'Clerk' }] }],
    conflicts: [{
      parties: ['The Guild', 'The Wardens'], issue: 'Control of the toll bridge', stakes: 'Commercial supremacy',
      intensity: 'high', desc: DESC, plotHooks: [HOOK],
    }],
  });
  const count = (text, needle) => text.split(needle).length - 1;

  test('each cross-settlement row prints once, even with its neighbour card open', () => {
    const { container } = render(e(RelationshipsTab, { settlement: town() }));
    const card = [...container.querySelectorAll('button')].find((b) => b.textContent.includes('Thornmere') && b.textContent.includes('A bridge both claim.'));
    fireEvent.click(card);
    const text = container.textContent;
    expect(count(text, CONTACT)).toBe(1);
    expect(count(text, ENGAGE)).toBe(1);
    expectAbsentWithAnchor(text, 'Known Contacts', CONTACT, 'R2 inner Known Contacts');
    // The legacy npcConnections reader stays inside the card (KEEP) and is not re-rendered
    // under NPC Relationships (R6 crossConns CUT).
    expect(count(text, LEGACY)).toBe(1);
    expect(text).toContain('NPC connections');
    // The type badge stays on the card.
    expect(card.textContent).toContain('rival');
  });

  test('the explainers go; the emergent banner is its count', () => {
    const text = render(e(RelationshipsTab, { settlement: town() })).container.textContent;
    const anchor = '◆ 2 emergent ties';
    expect(text).toContain(anchor);
    for (const gone of [
      'Links are removed when neighbours are delinked.',
      'Removed when the link is broken.',
      'would not exist under neutral slider conditions',
      'Cross-settlement NPC ties appear in each neighbour card above.',
      'Emergent conditions active',
    ]) expectAbsentWithAnchor(text, gone, anchor, 'R3-R6 explainer copy');
  });

  test('the conflict card: "A vs B · issue", stakes kept, template and plot hooks cut', () => {
    const text = render(e(RelationshipsTab, { settlement: town() })).container.textContent;
    const head = 'The Guild vs The Wardens · Control of the toll bridge';
    expect(text).toContain(head);
    expect(text).toContain('Commercial supremacy');
    expectAbsentWithAnchor(text, DESC, head, 'the desc template');
    expectAbsentWithAnchor(text, HOOK, head, 'the conflict plot hook (X-2)');
  });

  test('one page: a mount that still passes neighboursOnly renders the whole page (X-6)', () => {
    const text = render(e(RelationshipsTab, { settlement: town(), neighboursOnly: true })).container.textContent;
    expect(text).toContain('Neighbour Network (1)');
    expect(text).toContain('NPC Relationships (2)');
    expect(text).toContain('Active Conflicts (1)');
  });
});
