/** @vitest-environment jsdom */
/**
 * wizardCloseout.test.jsx — P145 / W-2 component contract.
 *
 * The pure builder is exercised in wizardCloseout.test.js (node). This
 * file pins the thin presentational shell: store wiring and that the
 * derived summary surfaces in the DOM (fact chips, the priority line,
 * the constraint line).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {
    config: {},
    institutionToggles: {},
    servicesToggles: {},
    goodsToggles: {},
    campaigns: [],
    customContent: {},
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
    useStore.__set({
      config: {},
      institutionToggles: {},
      servicesToggles: {},
      goodsToggles: {},
      campaigns: [],
      customContent: {},
    });
  });
  afterEach(() => cleanup());

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

  it('leads with "Fully procedural" when config == defaults (the delta is the focal line)', () => {
    render(<WizardCloseout />);
    // P3: when nothing deviates from a default roll, say so outright as the headline.
    expect(screen.getByText(/fully procedural/i)).toBeTruthy();
  });

  it('promotes the priority emphasis into the focal delta line', () => {
    useStore.__set({ config: { priorityEconomy: 80, priorityMagic: 70 } });
    render(<WizardCloseout />);
    // Emphasis is now the focal "<x>-led" delta, not a quiet "Priorities:" line.
    expect(screen.getByText(/Economy · Magic-led/)).toBeTruthy();
    // …and "Fully procedural" no longer shows, since the config deviated.
    expect(screen.queryByText(/fully procedural/i)).toBeNull();
  });

  it('promotes forced/excluded counts into the focal delta line', () => {
    useStore.__set({
      config: {},
      institutionToggles: {
        'town::market::Bank': { allow: true, require: true, forceExclude: false },
        'town::faith::Temple': { allow: false, require: false, forceExclude: true },
      },
      goodsToggles: {
        'town_good_iron': { allow: true, force: true, forceExclude: false },
      },
    });
    render(<WizardCloseout />);
    // Bank + iron forced; Temple excluded — surfaced as the delta, not buried.
    expect(screen.getByText(/2 forced · 1 excluded/)).toBeTruthy();
    expect(screen.queryByText(/fully procedural/i)).toBeNull();
  });
});
