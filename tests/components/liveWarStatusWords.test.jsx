/** @vitest-environment jsdom */
/**
 * STYLE-2 SW-12 (ledger D·5, 2026-11-09): the live war block's deployment row says
 * when the army marched in the realm's calendar and what the war costs at home,
 * in plain words — never a raw engine tick, never "war chest bleeding".
 */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import LiveWarStatus from '../../src/components/map/LiveWarStatus.jsx';

afterEach(cleanup);

describe('LiveWarStatus — the deployment row in the reader\'s words', () => {
  test('an army abroad reads its calendar week and its cost to the named home', () => {
    const campaign = { id: 'c1', worldState: { deployments: { s1: { targetId: 's2', sinceTick: 4, role: 'siege' } } } };
    const nameById = new Map([['s1', 'Ashford'], ['s2', 'Calder']]);
    render(<LiveWarStatus campaign={campaign} nameById={nameById} />);
    expect(screen.getByText('In the field since week 5 of spring, year 1. Fewer guards stand at home, and the war is costing Ashford its savings.')).toBeTruthy();
    expect(screen.queryByText(/since tick \d|war chest bleeding|garrison thinned/)).toBeNull();
  });
});
