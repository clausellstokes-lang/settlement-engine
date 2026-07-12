/** @vitest-environment jsdom */
/**
 * SessionMode — W-Session run-of-play takeover.
 *
 * Pins: composition renders the run-of-play content (NPCs, hooks, state), the
 * war panel resolves the owning campaign's worldState through the LIGHT war
 * read-models only, Esc closes, and — the constitutional guarantee — a
 * FREE / ANON render of a latent-pantheon settlement never names a latent
 * deity (the faith surface is FaithSection itself, unchanged).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      auth: { tier: 'anon' },
      isElevated: () => false,
      setPurchaseModalOpen: () => {},
      setActivePricingMoment: () => {},
      phase: 'draft',
      systemState: null,
      eventLog: [],
      campaigns: [],
      savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import SessionMode from '../../src/components/session/SessionMode.jsx';

const LATENT_NAME = 'Zzyraxil the Unnamed';

const settlementFixture = (over = {}) => ({
  id: 's_ab12cd34ef567890',
  name: 'Emberhold',
  tier: 'town',
  population: 2400,
  pressureSentence: 'The granaries are watched day and night.',
  npcs: [
    {
      name: 'Serah Voss', role: 'Captain of the Watch', power: 85,
      personality: { dominant: 'iron-spined', tell: 'taps her scabbard when lying' },
      goal: { short: 'hold the wall at any cost' },
      secret: { what: 'owes a debt to smugglers' },
      plotHooks: ['A midnight muster nobody ordered'],
    },
    { name: 'Old Tam', role: 'Innkeep', power: 20 },
  ],
  config: { latentPantheon: { patron: { name: LATENT_NAME } } },
  ...over,
});

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('SessionMode — run-of-play composition', () => {
  it('renders the pressure line, key NPCs (power-ordered), and hooks', () => {
    const { container } = render(
      <SessionMode settlement={settlementFixture()} saveId="11" onClose={() => {}} />,
    );
    expect(container.textContent).toContain('The granaries are watched day and night.');
    expect(container.textContent).toContain('Serah Voss');
    expect(container.textContent).toContain('taps her scabbard when lying');
    expect(container.textContent).toContain('A midnight muster nobody ordered');
  });

  it('shows the four-dimension state bands when the store carries systemState', () => {
    useStore.__set({
      systemState: {
        resilience: { value: 62, band: 'Stable' },
        volatility: { value: 40, band: 'Strained' },
        externalThreat: { value: 20, band: 'Stable' },
        resourcePressure: { value: 75, band: 'Critical' },
      },
    });
    const { container } = render(
      <SessionMode settlement={settlementFixture()} saveId="11" onClose={() => {}} />,
    );
    expect(container.textContent).toContain('Resilience');
    expect(container.textContent).toContain('Critical');
  });

  it('Esc closes', () => {
    const onClose = vi.fn();
    render(<SessionMode settlement={settlementFixture()} saveId="11" onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

describe('SessionMode — the live war panel (light read-models only)', () => {
  it('renders occupation from the owning campaign worldState, names via saved entries', () => {
    useStore.__set({
      campaigns: [{
        settlementIds: ['11', '22'],
        worldState: {
          canonizedAt: '2026-01-01', tick: 8,
          occupations: { 11: { occupierId: '22', state: 'contested', resistance: 0.5 } },
        },
      }],
      savedSettlements: [
        { id: '11', name: 'Emberhold' },
        { id: '22', name: 'Ironhold' },
      ],
    });
    const { container } = render(
      <SessionMode settlement={settlementFixture()} saveId="11" onClose={() => {}} />,
    );
    expect(container.textContent).toContain('The war right now');
    expect(container.textContent).toContain('Ironhold');
  });

  it('renders no war section for a non-campaign settlement', () => {
    const { container } = render(
      <SessionMode settlement={settlementFixture()} saveId="11" onClose={() => {}} />,
    );
    expect(container.textContent).not.toContain('The war right now');
  });
});

describe('SessionMode — the constitutional faith seam', () => {
  it('ANON: a latent-pantheon settlement NEVER names the latent deity (teaser only)', () => {
    const { container } = render(
      <SessionMode settlement={settlementFixture()} saveId="11" onClose={() => {}} />,
    );
    expect(container.textContent).not.toContain(LATENT_NAME);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
  });

  it('FREE: same guarantee', () => {
    useStore.__set({ auth: { tier: 'free' } });
    const { container } = render(
      <SessionMode settlement={settlementFixture()} saveId="11" onClose={() => {}} />,
    );
    expect(container.textContent).not.toContain(LATENT_NAME);
  });

  it('an ACTIVE embedded patron renders (FaithSection ACTIVE mode, as on the dossier)', () => {
    const s = settlementFixture({
      config: { primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', alignmentAxis: 'good', domain: 'sun' } },
    });
    render(<SessionMode settlement={s} saveId="11" onClose={() => {}} />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
  });
});
