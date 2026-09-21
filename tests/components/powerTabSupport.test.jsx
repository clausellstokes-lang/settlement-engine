/**
 * @vitest-environment jsdom
 *
 * tests/components/powerTabSupport.test.jsx
 *
 * ORDER A (owner 2026-07-22): clicking a power in the Power tab reveals the
 * institutions that stand behind it.
 *
 * THREE-STRATA REWORK (owner order 2026-07-22, "there are powers, there are
 * factions, and there are the relationships between several ... it needs a
 * rework"): the institution-support disclosure now lives on THE POWERS card (the
 * dominant stratum), not on the flat faction row — a faction's roster row carries
 * a compact "holds power" marker instead, so the web is never duplicated. These
 * pins were updated to target the power card accordingly. The two fixture
 * factions carry no `isGoverning`, so both are coup contenders → both are powers.
 * The disclosure is still keyboard-operable end to end:
 *   - the support list is hidden until the POWER CARD is expanded;
 *   - the card is a keyboard-operable disclosure (Enter / Space toggles it, and
 *     aria-expanded tracks state);
 *   - once open, each supporting institution renders with its typed basis line;
 *   - the institution name is itself an interactive link (per ORDER B: institutions
 *     link to their in-context profile, which surfaces the compendium identity).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { SUPPORT_BASIS } from '../../src/domain/dossier/powerSupport.js';

afterEach(cleanup);

// A minimal settlement whose institutions map to two different powers:
//  - Grand Market (economy)  -> aligned under Merchant Guild (top economy faction)
//  - City Barracks (military, factionSource) -> founded under the Watch
// Neither faction is the governing seat, so both present as coup contenders in
// THE POWERS stratum (each gets a power card).
function makeSettlement() {
  return {
    id: 'settlement.testburg',
    name: 'Testburg',
    powerStructure: {
      factions: [
        { faction: 'Merchant Guild', power: 60, category: 'economy', desc: 'The traders who hold the market.' },
        { faction: 'The Watch', power: 40, category: 'military', desc: 'The guards who hold the walls.' },
      ],
    },
    institutions: [
      { name: 'Grand Market', priorityCategory: 'economy' },
      { name: 'City Barracks', priorityCategory: 'military', factionSource: 'The Watch' },
    ],
  };
}

const render_ = () => {
  const s = makeSettlement();
  return render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
};

describe('PowerTab — the institution-support web (on THE POWERS card)', () => {
  it('hides the support list until the power card is expanded', () => {
    render_();
    // The support heading is not present while every power card is collapsed.
    expect(screen.queryByText(/Institutions behind this power/i)).toBeNull();
    expect(screen.queryByText('Grand Market')).toBeNull();
  });

  it('expands on Enter and reveals the supporting institutions with their basis', () => {
    render_();
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    expect(card.getAttribute('aria-expanded')).toBe('false');

    fireEvent.keyDown(card, { key: 'Enter' });

    expect(card.getAttribute('aria-expanded')).toBe('true');
    const detail = document.getElementById(card.getAttribute('aria-controls'));
    expect(detail).toBeTruthy();
    // The aligned institution + its typed basis phrase are shown.
    expect(within(detail).getByText('Grand Market')).toBeTruthy();
    expect(within(detail).getByText(SUPPORT_BASIS.aligned.merchant)).toBeTruthy();
    // Its name is an interactive link (opens the institution's in-context profile,
    // which surfaces the compendium-authored identity). The accessible name is the
    // institution name; the "View ... profile" hint rides the button title.
    const instLink = within(detail).getByRole('button', { name: 'Grand Market' });
    expect(instLink.getAttribute('title')).toMatch(/Grand Market profile/i);
  });

  it('toggles closed on a second Space press', () => {
    render_();
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    fireEvent.keyDown(card, { key: ' ' });
    expect(card.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(card, { key: ' ' });
    expect(card.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Grand Market')).toBeNull();
  });

  it('lists a founded institution under the faction that raised it', () => {
    render_();
    const card = screen.getByRole('button', { name: 'The Watch power details' });
    fireEvent.click(card);
    const detail = document.getElementById(card.getAttribute('aria-controls'));
    expect(within(detail).getByText('City Barracks')).toBeTruthy();
    expect(within(detail).getByText(SUPPORT_BASIS.founded)).toBeTruthy();
  });
});

// ── THE BASIS IS A CAPTION, NOT A ROW (2026-09-18) ──────────────────────────
// `why` is keyed by the BACKING FACTION'S archetype, so every aligned institution
// under one power carries the same sentence. Printed per row it read as a stutter:
// a merchant power with three houses behind it said "A commercial house of this
// power" three times down the card. The phrase now captions the group.
describe('PowerTab — the support basis is said once per group', () => {
  const manyAligned = () => ({
    id: 'settlement.stutterburg',
    name: 'Stutterburg',
    powerStructure: {
      factions: [
        { faction: 'Merchant Guild', power: 70, category: 'economy', desc: 'The traders who hold the market.' },
      ],
    },
    institutions: [
      { name: 'Grand Market', priorityCategory: 'economy' },
      { name: 'Coin Hall', priorityCategory: 'economy' },
      { name: 'Wool Exchange', priorityCategory: 'economy' },
    ],
  });

  it('says the aligned phrase ONCE for a bucket holding several aligned institutions', () => {
    const s = manyAligned();
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    fireEvent.click(card);
    const detail = document.getElementById(card.getAttribute('aria-controls'));

    // All three houses are listed…
    expect(within(detail).getByText('Grand Market')).toBeTruthy();
    expect(within(detail).getByText('Coin Hall')).toBeTruthy();
    expect(within(detail).getByText('Wool Exchange')).toBeTruthy();
    // …under exactly one copy of the basis phrase.
    expect(within(detail).getAllByText(SUPPORT_BASIS.aligned.merchant)).toHaveLength(1);
  });

  it('a bucket carrying both bases captions each group separately', () => {
    // The Watch raised the Barracks (founded) and backs the Armoury (aligned).
    const s = {
      id: 'settlement.bothburg',
      name: 'Bothburg',
      powerStructure: {
        factions: [{ faction: 'The Watch', power: 60, category: 'military', desc: 'The guards who hold the walls.' }],
      },
      institutions: [
        { name: 'City Barracks', priorityCategory: 'military', factionSource: 'The Watch' },
        { name: 'The Armoury', priorityCategory: 'military' },
      ],
    };
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const card = screen.getByRole('button', { name: 'The Watch power details' });
    fireEvent.click(card);
    const detail = document.getElementById(card.getAttribute('aria-controls'));

    expect(within(detail).getAllByText(SUPPORT_BASIS.founded)).toHaveLength(1);
    expect(within(detail).getAllByText(SUPPORT_BASIS.aligned.military)).toHaveLength(1);
    expect(within(detail).getByText('City Barracks')).toBeTruthy();
    expect(within(detail).getByText('The Armoury')).toBeTruthy();
  });
});

// ── §815 — THE RULING CHAIN: power → faction → named NPC, honest absence ─────
describe('PowerTab — the §815 ruling chain ("Who runs this place?")', () => {
  const base = () => ({
    id: 'settlement.chainburg',
    name: 'Chainburg',
    powerStructure: {
      government: 'Town Council',
      factions: [
        { faction: 'Merchant Guild', power: 55, powerLabel: 'Dominant', category: 'economy', isGoverning: true },
        { faction: 'The Watch', power: 30, category: 'military' },
      ],
    },
    npcs: [],
  });

  it('renders all three links when a ruler-titled NPC sits in the governing faction', () => {
    const s = base();
    s.npcs = [
      { id: 'n1', name: 'Aldric Vane', role: 'Guildmaster Mayor', factionAffiliation: 'Merchant Guild' },
      { id: 'n2', name: 'Plain Member', role: 'Clerk', factionAffiliation: 'Merchant Guild' },
    ];
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const chain = screen.getByTestId('ruling-chain');
    expect(chain.textContent).toContain('Who runs this place?');
    expect(chain.textContent).toContain('Merchant Guild');
    expect(chain.textContent).toContain('Town Council');
    expect(screen.getByTestId('ruling-chain-npc').textContent).toBe('Aldric Vane');
    expect(screen.queryByTestId('ruling-chain-absence')).toBeNull();
  });

  it('NEVER shows a merely-senior member as the seat — the chain ends honestly at the faction', () => {
    const s = base();
    s.npcs = [{ id: 'n2', name: 'Plain Member', role: 'Senior Clerk', factionAffiliation: 'Merchant Guild', importance: 9 }];
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    expect(screen.queryByTestId('ruling-chain-npc')).toBeNull();
    const absence = screen.getByTestId('ruling-chain-absence');
    expect(absence.textContent).toMatch(/No named seat-holder stands in the record/);
    expect(screen.getByTestId('ruling-chain').textContent).not.toContain('Plain Member'); // anchored: the chain block and its absence line were proven present above, so the surface lives; the absent name is the never-merely-senior claim.
  });

  it('a live missing-seat stressor reads AS the stressor story — the seat stands empty; claimants circle', () => {
    const s = base();
    s.powerStructure.factions[0].modifiers = ['vacant'];
    s.powerStructure.factions.push(
      { faction: 'Claimant Bloc A', power: 18, desc: 'Legal claim.' },
      { faction: 'Claimant Bloc B', power: 15, desc: 'Popular claim.' },
    );
    // Even a ruler-titled NPC does not fill a VACANT seat — the stressor owns it.
    s.npcs = [{ id: 'n1', name: 'Old Mayor', role: 'Mayor (deposed)', factionAffiliation: 'Merchant Guild' }];
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const absence = screen.getByTestId('ruling-chain-absence');
    expect(absence.textContent).toMatch(/The seat stands empty; 2 claimants circle: Claimant Bloc A, Claimant Bloc B\./);
    expect(screen.getByTestId('ruling-chain').textContent).toMatch(/the seat itself stands vacant/);
    expect(screen.queryByTestId('ruling-chain-npc')).toBeNull();
  });

  it('a ladder-lit world resolves the seat from the governing faction top rung (warSeatBooks convention)', () => {
    const s = base();
    s.npcLadder = {
      factions: {
        // The mirror key is ladderFactionKeyOf's own spelling: `fac.` + slug.
        'fac.merchant_guild': { rungs: [{ npcId: 'x1', name: 'Serena Copperlane', standing: 0.9 }, { npcId: 'x2', name: 'Under Clerk', standing: 0.4 }] },
      },
    };
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    expect(screen.getByTestId('ruling-chain-npc').textContent).toBe('Serena Copperlane');
  });

  it('a pre-density settlement with no NPCs renders the chain as far as the data goes', () => {
    const s = base();
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const chain = screen.getByTestId('ruling-chain');
    expect(chain.textContent).toContain('Merchant Guild');
    expect(screen.getByTestId('ruling-chain-absence').textContent).toMatch(/ends, honestly, at the faction/);
  });
});
