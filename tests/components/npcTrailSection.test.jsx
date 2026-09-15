/** @vitest-environment jsdom */
/**
 * npcTrailSection.test.jsx — LONG TAIL #39 car 5, the War-door surface for the
 * ladder's dated contests and seat changes.
 *
 * THE ARM THAT MATTERS is the fail-closed pair, on ONE fixture: a viewer without
 * ground truth gets NOTHING AT ALL (there is no player-facing form of this page —
 * a contest the loser never learned of is the loser's secret), and a DM on the
 * same fixture gets the dated trail. The rest pins the empty-state discipline and
 * the rule that no ladder key ever reaches a reader.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

let storeState = {};
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeState) }));

import NpcTrailSection from '../../src/components/map/NpcTrailSection.jsx';

/** The engine's own ledger shape: settlement id → { factions, npcs, contests, seatTransitions }. */
const worldState = () => ({
  tick: 40,
  spatialLedgers: {
    npcLadder: {
      ash: {
        factions: {},
        npcs: { 'ash:aldis': {}, 'ash:mira': {} },
        contests: {
          'contest.ash.trade.4': {
            id: 'contest.ash.trade.4', signalVar: 'trade', kind: 'opposed',
            a: { nid: 'ash:aldis' }, b: { nid: 'ash:mira' },
            openedWeek: 4, resolvedWeek: 9, outcome: 'fired', loserNid: 'ash:aldis',
          },
        },
        seatTransitions: [
          { id: 'seat.1', fromRulerId: 'ash:mira', toRulerId: 'ash:aldis', cause: 'faction_challenge', tick: 20 },
        ],
      },
    },
  },
});

/** The display-safe mirror the names are read from. */
const saves = () => ([{
  id: 'ash',
  settlement: {
    npcLadder: { factions: { council: { rungs: [{ npcId: 'ash:aldis', name: 'Aldis' }, { npcId: 'ash:mira', name: 'Mira' }] } } },
  },
}]);

const campaign = () => ({ id: 'c1', worldState: worldState() });

const asDm = () => { storeState = { auth: { tier: 'premium' }, isElevated: () => false, savedSettlements: saves() }; };
const asPlayer = () => { storeState = { auth: { tier: 'free' }, isElevated: () => false, savedSettlements: saves() }; };

afterEach(() => { cleanup(); vi.clearAllMocks(); });
beforeEach(() => { storeState = {}; });

describe('NpcTrailSection — ⛔ the fail-closed gate', () => {
  test('a viewer WITHOUT ground truth gets nothing at all — there is no player form of this page', () => {
    asPlayer();
    const { container } = render(<NpcTrailSection campaign={campaign()} />);
    expect(container.innerHTML).toBe('');
  });

  test('…and a DM on the SAME fixture gets the dated trail (the gate is a gate, not a blank page)', () => {
    asDm();
    render(<NpcTrailSection campaign={campaign()} />);
    const block = screen.getByTestId('npc-trail');
    expect(block.textContent).toContain('Who contested whom');
    expect(block.textContent).toContain('Aldis: 2 recorded turnings');
    expect(block.textContent).toContain('Contested Mira, and lost.');
    expect(block.textContent).toContain('Took the governing seat from Mira — faction challenge.');
    // Mira's own side of the same two rows, from her standpoint.
    expect(block.textContent).toContain('Contested Aldis, and did not lose.');
    expect(block.textContent).toContain('Left the governing seat to Aldis — faction challenge.');
    expect(screen.getAllByTestId('npc-trail-row')).toHaveLength(2);
  });

  test('an elevated (non-premium) session is DM too', () => {
    storeState = { auth: { tier: 'free' }, isElevated: () => true, savedSettlements: saves() };
    render(<NpcTrailSection campaign={campaign()} />);
    expect(screen.getByTestId('npc-trail')).toBeTruthy();
  });
});

describe('NpcTrailSection — legibility and the empty state', () => {
  test('every line is dated in the reader\'s calendar and carries no ladder key', () => {
    asDm();
    const { container } = render(<NpcTrailSection campaign={campaign()} />);
    expect(container.textContent).toContain('week 5 of spring, year 1'); // openedWeek 4
    expect(container.textContent).toContain('week 8 of summer, year 1'); // tick 20
    // anchored: the two calendar phrases above are asserted present, so this page is a live render and the absences below are measured against real prose.
    expect(container.textContent).not.toContain('ash:');
    // anchored: same live page as the calendar assertions two lines up; a blank render would have failed there first.
    expect(container.textContent).not.toMatch(/faction_challenge|seatTransitions|contest\./);
  });

  test('a realm whose ladder recorded nothing renders NOTHING', () => {
    asDm();
    const { container } = render(
      <NpcTrailSection campaign={{ id: 'c2', worldState: { tick: 5, spatialLedgers: { npcLadder: { ash: { factions: {}, npcs: {}, contests: {}, seatTransitions: [] } } } } }} />,
    );
    expect(container.innerHTML).toBe('');
  });

  test('no campaign, no ladder, and a garbage ledger are all equally silent', () => {
    asDm();
    for (const c of [null, { id: 'x' }, { id: 'y', worldState: {} }, { id: 'z', worldState: { spatialLedgers: { npcLadder: 'nope' } } }]) {
      const { container, unmount } = render(<NpcTrailSection campaign={c} />);
      expect(container.innerHTML, JSON.stringify(c)).toBe('');
      unmount();
    }
  });

  test('a figure the mirror no longer carries is not listed, and is unnamed in another\'s line', () => {
    // Mira has left every rung, so the mirror cannot name her. Aldis's row still
    // renders — the history is real — and simply names nobody.
    storeState = {
      auth: { tier: 'premium' },
      isElevated: () => false,
      savedSettlements: [{ id: 'ash', settlement: { npcLadder: { factions: { council: { rungs: [{ npcId: 'ash:aldis', name: 'Aldis' }] } } } } }],
    };
    const { container } = render(<NpcTrailSection campaign={campaign()} />);
    expect(screen.getAllByTestId('npc-trail-row')).toHaveLength(1);
    expect(container.textContent).toContain('Contested a rival, and lost.');
    expect(container.textContent).toContain('Took the governing seat from whoever held it before');
    // anchored: the two sentences above are asserted present, so the row really rendered and this absence is the name being withheld rather than the page being empty.
    expect(container.textContent).not.toContain('Mira');
  });
});
