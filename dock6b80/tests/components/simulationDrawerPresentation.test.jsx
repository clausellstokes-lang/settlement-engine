/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: vi.fn() },
  EVENTS: { SIMULATION_DRAWER_OPENED: 'simulation_drawer_opened' },
}));

vi.mock('../../src/components/PipelineRail.jsx', () => ({
  default: () => <div>Simulation stages</div>,
}));

import SimulationDrawer from '../../src/components/dossier/SimulationDrawer.jsx';

afterEach(cleanup);

describe('Simulation drawer — reader language', () => {
  it('explains replayability without implementation jargon or a stale stage count', () => {
    render(<SimulationDrawer />);
    const trigger = screen.getByRole('button', { name: 'How this was simulated' });
    expect(trigger.getAttribute('title'))
      .toBe('See the stages and decisions that built this settlement');

    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toMatch(/same choices and seed rebuild the same settlement/i);
    expect(dialog.textContent).toMatch(/Open a stage to see what it decided and why/i);
    expect(dialog.textContent).not.toMatch(/pure-functional|deterministic|fourteen|seventeen/i);
  });
});
