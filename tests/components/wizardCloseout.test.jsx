/** @vitest-environment jsdom */
/**
 * wizardCloseout.test.jsx — P145 / W-2 component contract.
 *
 * The pure builder is exercised in wizardCloseout.test.js (node). This
 * file pins the thin presentational shell: store wiring, the flag gate,
 * and that the derived summary surfaces in the DOM (fact chips, the
 * priority line, the constraint line).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

const flagMock = vi.fn(() => true);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

vi.mock('../../src/store/index.js', () => {
  const data = {
    config: {},
    institutionToggles: {},
    servicesToggles: {},
    goodsToggles: {},
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import WizardCloseout from '../../src/components/generate/WizardCloseout.jsx';
import { useStore } from '../../src/store/index.js';

describe('WizardCloseout — W-2 close-out card', () => {
  beforeEach(() => {
    flagMock.mockImplementation((name) => name === 'wizardCloseout');
    useStore.__set({
      config: {},
      institutionToggles: {},
      servicesToggles: {},
      goodsToggles: {},
    });
  });
  afterEach(() => cleanup());

  it('renders nothing when the flag is off', () => {
    flagMock.mockImplementation(() => false);
    const { container } = render(<WizardCloseout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the labelled summary card with a header', () => {
    render(<WizardCloseout />);
    expect(screen.getByRole('group', { name: 'Configuration summary' })).toBeTruthy();
    expect(screen.getByText('Ready to generate')).toBeTruthy();
  });

  it('surfaces humanized config facts as chips', () => {
    useStore.__set({
      config: { settType: 'city', culture: 'germanic', magicExists: true },
    });
    render(<WizardCloseout />);
    // Labels + values both render; values are humanized.
    expect(screen.getByText('Tier')).toBeTruthy();
    expect(screen.getByText('City')).toBeTruthy();
    expect(screen.getByText('Germanic')).toBeTruthy();
    expect(screen.getByText('On')).toBeTruthy();
  });

  it('shows "Balanced" when no slider is emphasized, else the emphasis list', () => {
    const { rerender } = render(<WizardCloseout />);
    expect(screen.getByText('Balanced')).toBeTruthy();

    useStore.__set({ config: { priorityEconomy: 80, priorityMagic: 70 } });
    rerender(<WizardCloseout />);
    expect(screen.getByText('Economy · Magic')).toBeTruthy();
  });

  it('summarizes "no constraints" when nothing is forced/excluded', () => {
    render(<WizardCloseout />);
    expect(screen.getByText('No manual constraints — fully procedural.')).toBeTruthy();
  });

  it('summarizes forced/excluded counts when constraints exist', () => {
    useStore.__set({
      institutionToggles: {
        'town::market::Bank': { allow: true, require: true, forceExclude: false },
        'town::faith::Temple': { allow: false, require: false, forceExclude: true },
      },
      goodsToggles: {
        'town_good_iron': { allow: true, force: true, forceExclude: false },
      },
    });
    render(<WizardCloseout />);
    // Bank + iron forced; Temple excluded.
    expect(screen.getByText('2 forced · 1 excluded')).toBeTruthy();
  });
});
