/** @vitest-environment jsdom */
/**
 * faithTabDeepening.test.jsx — W-FAITH F7c: the deepening rows IN the T11 shell.
 *
 * What the component arms pin (the leaf's arithmetic has its own suite):
 *   • A creed that authored character / boon / bane shows its depth rows inside
 *     its own niche row; the cumulative-field block renders in band words.
 *   • HONEST ABSENCE — the same tab with nothing authored renders NO depth
 *     node and NO field block (never a stub, never filler).
 *   • The rows ride the shell's own gates: no live ranks ⇒ no niche rows ⇒ no
 *     depth rows (a static embed keeps FaithSection only), and the
 *     constitutional teaser path never gains a deity name from this car.
 *   • No numeral appears in any deepening node's text.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

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
      campaigns: [],
      savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import FaithTab from '../../src/components/new/tabs/FaithTab.jsx';
import { FAITH_FIELD_TUNING } from '../../src/domain/worldPulse/faithTuningSurface.js';

const STRENGTH = /** @type {Record<string, number>} */ (
  /** @type {unknown} */ (FAITH_FIELD_TUNING.STRENGTH));

/** A live faith town whose patron authored character, a jealous boon, and whose
 *  pantheon audibly moves two channels. */
const deepTown = () => ({
  name: 'Sunhold',
  config: {
    primaryDeitySnapshot: {
      name: 'Sunlord Aurelian', rankAxis: 'major', alignmentAxis: 'good',
      characterAxes: ['TEMPER:vice:defining', 'GENEROSITY:virtue:a_touch', 'CONTENT:vice:marked'],
      boonChannel: 'harvest', boonStrength: 'firm',
      baneChannel: 'war_readiness', baneStrength: 'heavy',
    },
    faithProfile: {
      deities: [
        { name: 'Sunlord Aurelian', share: 62, standing: 'ascendant', legitimacy: 0.8, isPatron: true, niche: 'warlike:good' },
      ],
      field: { channels: { harvest: STRENGTH.firm, trade: -(STRENGTH.faint + STRENGTH.firm) / 2 } },
    },
  },
});

/** The same town with nothing deepened: no characterAxes, no boon/bane, no field. */
const shallowTown = () => ({
  name: 'Sunhold',
  config: {
    primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', alignmentAxis: 'good' },
    faithProfile: {
      deities: [
        { name: 'Sunlord Aurelian', share: 62, standing: 'ascendant', legitimacy: 0.8, isPatron: true, niche: 'warlike:good' },
      ],
    },
  },
});

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('FaithTab — the F7c deepening rows in the T11 shell', () => {
  it('an authored creed shows its top-3, boon and bane inside its niche row, band words only', () => {
    render(<FaithTab settlement={deepTown()} saveId={null} />);
    const character = screen.getByTestId('faith-depth-character');
    // The pinned total order: defining first, then the marked vice, then a touch.
    expect(character.textContent).toContain('Known for');
    expect(character.textContent).toMatch(/wrathful \(defining\).*envious \(marked\).*generous \(a touch\)/);
    const boon = screen.getByTestId('faith-depth-boon');
    expect(boon.textContent).toContain('harvest');
    expect(boon.textContent).toContain('firm');
    // The jealous marker rides the boon as the register's own word.
    expect(boon.textContent).toContain('jealous');
    const bane = screen.getByTestId('faith-depth-bane');
    expect(bane.textContent).toContain('war readiness');
    expect(bane.textContent).toContain('heavy');
  });

  it('the cumulative field renders one banded row per audible channel', () => {
    render(<FaithTab settlement={deepTown()} saveId={null} />);
    expect(screen.getByTestId('faith-field-block')).toBeTruthy();
    const rows = screen.getAllByTestId('faith-field-row');
    expect(rows).toHaveLength(2);
    // Codepoint order: harvest before trade.
    expect(rows[0].textContent).toContain('harvest');
    expect(rows[0].textContent).toContain('blessed');
    expect(rows[0].textContent).toContain('firm');
    expect(rows[1].textContent).toContain('trade');
    expect(rows[1].textContent).toContain('burdened');
    expect(rows[1].textContent).toContain('faint');
  });

  it('HONEST ABSENCE — nothing authored renders no depth node and no field block', () => {
    render(<FaithTab settlement={shallowTown()} saveId={null} />);
    // The niche row itself still renders (the shell's own surface is live)...
    expect(screen.getAllByTestId('faith-niche-row')).toHaveLength(1);
    // ...but this car adds NOTHING to it.
    expect(screen.queryByTestId('faith-depth-character')).toBeNull();
    expect(screen.queryByTestId('faith-depth-boon')).toBeNull();
    expect(screen.queryByTestId('faith-depth-bane')).toBeNull();
    expect(screen.queryByTestId('faith-field-block')).toBeNull();
  });

  it('a STATIC embed (no live profile) shows no niche rows and therefore no depth rows', () => {
    const town = deepTown();
    delete town.config.faithProfile;
    render(<FaithTab settlement={town} saveId={null} />);
    expect(screen.queryByTestId('faith-niche-row')).toBeNull();
    expect(screen.queryByTestId('faith-depth-character')).toBeNull();
    expect(screen.queryByTestId('faith-field-block')).toBeNull();
  });

  it('the constitutional teaser path gains nothing: a latent-pantheon town stays nameless', () => {
    const LATENT = 'Zzyraxil the Unnamed';
    const { container } = render(<FaithTab settlement={{
      name: 'Quietford',
      config: { latentPantheon: { patron: { name: LATENT, characterAxes: ['TEMPER:vice:defining'], boonChannel: 'harvest', boonStrength: 'heavy' } } },
    }} saveId={null} />);
    // The liveness anchor: the gated surface rendered its teaser, so the render
    // is real faith content and the negative below cannot pass vacuously.
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    // anchored: the faith-teaser assertion above proves the render is live
    expect(container.textContent).not.toContain(LATENT);
    expect(screen.queryByTestId('faith-depth-character')).toBeNull();
    expect(screen.queryByTestId('faith-field-block')).toBeNull();
  });

  it('no numeral appears in any deepening node', () => {
    render(<FaithTab settlement={deepTown()} saveId={null} />);
    const nodes = [
      screen.getByTestId('faith-depth-character'),
      screen.getByTestId('faith-depth-boon'),
      screen.getByTestId('faith-depth-bane'),
      screen.getByTestId('faith-field-block'),
    ];
    for (const node of nodes) {
      expect(node.textContent.length).toBeGreaterThan(0);
      // anchored: the non-empty assertion above proves this node carries live text
      expect(node.textContent).not.toMatch(/\d/);
    }
  });
});
