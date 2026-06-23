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

  it('a corrupt NPC reads an explicit "Compromised" tag', () => {
    renderGroup({ id: 'n1', name: 'Captain Vex', corrupt: true, corruptTies: { criminalInstitution: "Thieves' Guild" } });
    expandCard('Captain Vex');
    expect(screen.getByText('Compromised')).toBeTruthy();
    expect(screen.getByText(/tied to Thieves' Guild/)).toBeTruthy();
  });

  it('an ousted NPC reads "Exposed", not "Compromised"', () => {
    renderGroup({ id: 'n2', name: 'Former Vex', corrupt: false, ousted: true });
    expandCard('Former Vex');
    expect(screen.getByText('Exposed')).toBeTruthy();
    expect(screen.queryByText('Compromised')).toBeNull();
  });
});

describe('ServiceItem — Compromised institution marker', () => {
  const compromised = new Map([
    ['city watch', 'revealed'],
    ['shadow ministry', 'covert'],
  ]);

  it('a revealed institution reads "COMPROMISED"', () => {
    render(<ServiceItem svc={{ name: 'City Watch', institution: 'City Watch' }} compromised={compromised} />);
    expect(screen.getByText('COMPROMISED')).toBeTruthy();
  });

  it('a covert capture reads "COMPROMISED (covert)"', () => {
    render(<ServiceItem svc={{ name: 'Ministry', institution: 'Shadow Ministry' }} compromised={compromised} />);
    expect(screen.getByText('COMPROMISED (covert)')).toBeTruthy();
  });

  it('a clean institution shows no compromised marker', () => {
    render(<ServiceItem svc={{ name: 'Bakery', institution: 'Guild of Bakers' }} compromised={compromised} />);
    expect(screen.queryByText(/COMPROMISED/)).toBeNull();
  });
});
