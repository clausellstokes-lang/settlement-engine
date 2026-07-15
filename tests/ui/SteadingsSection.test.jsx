/**
 * @vitest-environment jsdom
 *
 * tests/ui/SteadingsSection.test.jsx — W-LIFECYCLE stage 3: the dossier
 * steadings section (design §3). Zero footprint for a world without lifecycle
 * state; remnant + ancient banners and the steading cards when lit.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import SteadingsSection from '../../src/components/new/tabs/SteadingsSection.jsx';
import { useStore } from '../../src/store/index.js';

afterEach(() => {
  cleanup();
  useStore.setState({ campaigns: [] });
});

const baseSettlement = (over = {}) => ({ id: 'a', name: 'Ashford', config: {}, ...over });

describe('SteadingsSection — render gates', () => {
  test('ZERO FOOTPRINT: renders nothing for a settlement without lifecycle state', () => {
    const { container } = render(<SteadingsSection settlement={baseSettlement()} />);
    expect(container.firstChild).toBeNull();
  });

  test('a remnant settlement shows the grade banner with the fates prose', () => {
    render(<SteadingsSection settlement={baseSettlement({ lifecycleStatus: 'relic_ruin' })} />);
    expect(screen.getByText('Relic ruin')).toBeTruthy();
    expect(screen.getByText(/fates unresolved/)).toBeTruthy();
  });

  test('a generation-seeded ancient shows the nearby-ruin banner', () => {
    render(<SteadingsSection settlement={baseSettlement({ history: { ancientRuin: { name: 'Vaelakar', yearsAgo: 320 } } })} />);
    expect(screen.getByText('Ancient ruin nearby')).toBeTruthy();
    expect(screen.getByText(/Vaelakar/)).toBeTruthy();
  });

  test('satellite steadings render as cards from the campaign ledger (charter-pending visible)', () => {
    useStore.setState({
      campaigns: [{
        id: 'c1', settlementIds: ['a'],
        worldState: {
          spatialLedgers: {
            satellites: {
              a: {
                steadings: {
                  s1: { id: 's1', name: 'Weirbrook', tier: 'hamlet', population: 412, provenance: 'growth', orbit: 0, charterPending: true },
                  s2: { id: 's2', name: 'Ironditch', tier: 'thorp', population: 24, provenance: 'resource_strike', resourceKey: 'iron_deposits', orbit: 1 },
                },
              },
            },
          },
        },
      }],
    });
    render(<SteadingsSection settlement={baseSettlement()} />);
    expect(screen.getByText('Steadings (2)')).toBeTruthy();
    expect(screen.getByText('Weirbrook')).toBeTruthy();
    expect(screen.getByText(/a charter awaits/)).toBeTruthy();
    expect(screen.getByText(/iron deposits/)).toBeTruthy();
  });
});
