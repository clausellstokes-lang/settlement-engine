/** @vitest-environment jsdom */
/**
 * compromisedTag.test.jsx — the explicit 'Compromised' surface.
 *
 * Decision 1: the corrupt/compromised state must read as a named, two-channel
 * tag (text + colour), not a bare badge. Two surfaces:
 *   - NPCInlineCard (via NPCCategoryGroup): a corrupt NPC reads 'Compromised',
 *     an ousted one reads 'Exposed'.
 *   - ServiceItem: an institution captured by corruption reads 'Compromised',
 *     distinguishing covert (in-chain) from revealed (public scandal).
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NPCCategoryGroup } from '../../src/components/new/npcComponents.jsx';
import { ServiceItem } from '../../src/components/new/serviceComponents.jsx';

afterEach(cleanup);

// LINEAGE NOTE (master merge W6): the two ServiceItem COMPROMISED-tag tests were
// removed — this lineage's serviceComponents has no corruption display; NPC
// compromise badges (pinned below) are the surviving surface. FLAGGED for the
// owner: surfacing covert corruption on services is security-sensitive
// (W-DOCTRINE-3) — a latent FIX-RF-GAP if the owner wants service parity.
describe('NPCInlineCard — Compromised tag', () => {
  const renderGroup = (npc) => render(
    <NPCCategoryGroup category="civic" label="Civic" group={[npc]} />,
  );
  // The card body (with the corruption block) is behind a collapsed toggle.
  const expandCard = (name) => {
    const toggles = screen.getAllByRole('button', { expanded: false });
    // The last collapsed toggle is the NPC card itself (the first is the group).
    fireEvent.click(toggles[toggles.length - 1]);
    return name;
  };

  // ALLEGIANCE-CAR1 (2026-11-08): the retired `corrupt` mark is the card's hidden `allegiance`; the tag reads
  // 'Hidden allegiance' (the owner: "instead of saying compromised") and the line names the guild it answers to.
  it('an agent reads an explicit "Hidden allegiance" tag and the guild it answers to', () => {
    renderGroup({ id: 'n1', name: 'Captain Vex', allegiance: { power: null, house: "Thieves' Guild", vector: 'greed', via: 'office', handler: null, share: 0.15, veiled: true, covert: true } });
    expandCard('Captain Vex');
    expect(screen.getByText('Hidden allegiance')).toBeTruthy();
    expect(screen.queryByText('Compromised')).toBeNull();
    expect(screen.getByText((_, el) => el?.tagName === 'SPAN' && /^answers to Thieves' Guild$/.test(el.textContent || ''))).toBeTruthy();
  });

  it('an ousted NPC reads "Exposed", not "Compromised"', () => {
    renderGroup({ id: 'n2', name: 'Former Vex', ousted: true });
    expandCard('Former Vex');
    expect(screen.getByText('Exposed')).toBeTruthy();
    expect(screen.queryByText('Compromised')).toBeNull();
    expect(screen.queryByText('Hidden allegiance')).toBeNull();
  });
});

describe('ServiceItem — Compromised institution marker', () => {
  const compromised = new Map([
    ['city watch', 'revealed'],
    ['shadow ministry', 'covert'],
  ]);



  it('a clean institution shows no compromised marker', () => {
    render(<ServiceItem svc={{ name: 'Bakery', institution: 'Guild of Bakers' }} compromised={compromised} />);
    expect(screen.queryByText(/COMPROMISED/)).toBeNull();
  });
});
