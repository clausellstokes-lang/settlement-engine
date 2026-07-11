/** @vitest-environment jsdom */
/**
 * PantheonActivationStrip — Phase 5 W-C4 activation/dormancy strip.
 *
 * Pins OUR four milestones (latent baked → authored → assigned/activated →
 * dynamics advancing), the Live/Dormant badge, and the constitutional wall: the
 * strip is NAME-FREE — a settlement's assigned deity name never leaks into it.
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock the store; each test sets what useStore returns (faithSection pattern).
import { vi } from 'vitest';
vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, { customContent: { deities: [] }, settlement: null, savedSettlements: [], campaigns: [] });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import PantheonActivationStrip, { computePantheonActivation } from '../../src/components/compendium/PantheonActivationStrip.jsx';

const SECRET = 'Xarnoth the Unspoken';

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('computePantheonActivation — the four flags', () => {
  it('latent seed only ⇒ latent true, authored/assigned/dynamics false', () => {
    const state = { settlement: { config: { latentPantheon: { patron: { name: SECRET } } } }, customContent: { deities: [] } };
    expect(computePantheonActivation(state)).toMatchObject({ latent: true, authored: false, assigned: false, dynamicsOn: false, authoredCount: 0 });
  });

  it('authored + assigned + dynamics ⇒ all true (Live)', () => {
    const state = {
      customContent: { deities: [{ name: 'A' }, { name: 'B' }] },
      settlement: { config: { primaryDeitySnapshot: { name: SECRET } } },
      campaigns: [{ worldState: { pantheon: { 'deity:x': { seats: 2 } } } }],
    };
    expect(computePantheonActivation(state)).toMatchObject({ latent: false, authored: true, assigned: true, dynamicsOn: true, authoredCount: 2 });
  });

  it('assigned detected from a saved settlement; dynamics from the religionDynamicsEnabled rule', () => {
    const state = {
      customContent: { deities: [{ name: 'A' }] },
      savedSettlements: [{ settlement: { config: { primaryDeitySnapshot: { name: SECRET } } } }],
      campaigns: [{ worldState: { simulationRules: { religionDynamicsEnabled: true } } }],
    };
    expect(computePantheonActivation(state)).toMatchObject({ assigned: true, dynamicsOn: true });
  });
});

describe('PantheonActivationStrip — render', () => {
  it('shows Dormant with only a latent seed and never names the (latent or assigned) deity', () => {
    useStore.__set({ settlement: { config: { latentPantheon: { patron: { name: SECRET } } } } });
    const { container } = render(<PantheonActivationStrip />);
    expect(screen.getByTestId('pantheon-activation-badge').textContent).toMatch(/dormant/i);
    expect(container.textContent).not.toContain(SECRET);
  });

  it('shows Live when authored + assigned + dynamics all hold, still name-free', () => {
    useStore.__set({
      customContent: { deities: [{ name: 'A' }] },
      settlement: { config: { primaryDeitySnapshot: { name: SECRET } } },
      campaigns: [{ worldState: { pantheon: { 'deity:x': { seats: 1 } } } }],
    });
    const { container } = render(<PantheonActivationStrip />);
    expect(screen.getByTestId('pantheon-activation-badge').textContent).toMatch(/live/i);
    // The wall: the assigned deity's name never appears in the strip.
    expect(container.textContent).not.toContain(SECRET);
    // The authored count IS shown (a count, not a name).
    expect(container.textContent).toMatch(/Authored: 1 deity/);
  });
});
