/** @vitest-environment jsdom */
/**
 * powerTabLadder.test.jsx — [game-feel-1] the ladder display wire.
 *
 * The secrets-safe DM ladder read-model (ladderRead / mirrorOf) is now hosted on its
 * declared consumer, the dossier Power tab. This pins:
 *   • a populated mirror renders "The Ladder" with each faction's rungs (name + standing);
 *   • the SECRETS SEAM: raw nids never reach the DOM (only names + normalized standing);
 *   • a dark world (no npcLadder mirror) hides the section entirely (byte-identical dark).
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { PowerTab } from '../../src/components/new/tabs/PowerTab.jsx';
import { ladderFactionKeyOf } from '../../src/domain/townMap/ladderRead.js';

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({ focusedEntity: null }),
}));

const faction = { faction: 'The Trade Compact', power: 60, isGoverning: true, powerLabel: 'Dominant' };
const powerStructure = { factions: [faction], stability: 'Stable', publicLegitimacy: null };

/** A settlement whose npcLadder mirror is keyed exactly as the read side expects. */
function withLadder() {
  const key = ladderFactionKeyOf(faction);
  return {
    npcLadder: {
      factions: {
        [key]: {
          rungs: [
            { npcId: 'nid-alda', name: 'Alda Rook', standing: 0.9 },
            { npcId: 'nid-bren', name: 'Bren Vale', standing: 0.4 },
          ],
          instability: 0.2,
        },
      },
      goals: {},
    },
  };
}

describe('PowerTab — The Ladder section (game-feel-1)', () => {
  afterEach(() => { cleanup(); vi.clearAllMocks(); });

  test('renders each faction rung (name) from the read-model mirror', () => {
    render(<PowerTab powerStructure={powerStructure} settlement={withLadder()} />);
    expect(screen.getByText('The Ladder')).toBeTruthy();
    expect(screen.getByText('Alda Rook')).toBeTruthy();
    expect(screen.getByText('Bren Vale')).toBeTruthy();
    // instability wired through ladderInstabilityOf → the churn chip
    expect(screen.getByText(/unstable/i)).toBeTruthy();
  });

  test('secrets seam: raw nids never render as visible text', () => {
    render(<PowerTab powerStructure={powerStructure} settlement={withLadder()} />);
    expect(screen.queryByText('nid-alda')).toBeNull();
    expect(screen.queryByText('nid-bren')).toBeNull();
  });

  test('dark world: no ladder mirror ⇒ the section is hidden (byte-identical dark)', () => {
    render(<PowerTab powerStructure={powerStructure} settlement={{}} />);
    expect(screen.queryByText('The Ladder')).toBeNull();
  });
});
