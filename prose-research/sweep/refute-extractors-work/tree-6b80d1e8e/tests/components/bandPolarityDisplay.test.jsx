/**
 * @vitest-environment jsdom
 *
 * bandPolarityDisplay.test.jsx — the RENDER half of the G9/G10 polarity fix
 * (Wave R-5b batch 1, item #3). The domain half lives in
 * tests/domain/bandPolarity.test.js; this file pins what a reader actually sees.
 *
 * The defect was only ever visible at the render boundary. The four-dimension
 * tile printed a green "STABLE" beside a full pressure bar for a settlement at
 * volatility 95, and the Causes tab printed "COLLAPSED" for maximal crime — a
 * word a regular human reads as "the crime is gone". Both surfaces are pinned
 * here in BOTH directions, with a higher-is-better control in each so a future
 * over-correction that flips everything reds too.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { SystemStateGrid } from '../../src/components/settlement/SystemStateBar.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

afterEach(cleanup);

/** A crisis settlement: high on all three pressure dimensions, low resilience. */
const CRISIS = {
  id: 'crisis',
  config: {
    monsterThreat: 'plagued',
    nearbyResourcesState: { iron: 'depleted', timber: 'depleted' },
    tradeRouteAccess: 'isolated',
  },
  economicState: {
    prosperity: { tier: 'Struggling' },
    primaryExports: ['grain'],
    safetyProfile: { blackMarketCapture: 95 },
  },
  powerStructure: {
    factions: [{ name: 'Syndicate', power: 90, type: 'criminal' }, {}, {}, {}, {}, {}],
    conflicts: [{}, {}, {}, {}, {}],
    publicLegitimacy: { score: 10 },
  },
  stressors: [{ type: 'siege' }, { type: 'raid' }, { type: 'war' }],
};

/** Nothing wrong anywhere. */
const CALM = {
  id: 'calm',
  config: { monsterThreat: 'safe', nearbyResourcesState: {}, tradeRouteAccess: 'road' },
  economicState: {
    prosperity: { tier: 'Comfortable' },
    primaryExports: ['grain', 'wool', 'iron'],
    safetyProfile: { blackMarketCapture: 0 },
  },
  powerStructure: { factions: [{}], conflicts: [], publicLegitimacy: { score: 80 } },
  stressors: [],
};

/** The tile for one dimension, found by its label. */
function tileFor(container, label) {
  const spans = [...container.querySelectorAll('span')];
  const labelSpan = spans.find(s => s.textContent === label);
  expect(labelSpan, `no tile labelled ${label}`).toBeTruthy();
  return labelSpan.closest('[role="button"]');
}

describe('SystemStateGrid — the band word matches the pressure it sits beside', () => {
  it('a crisis settlement shows a BAD band on the lower-is-better dimensions', () => {
    const { container } = render(<SystemStateGrid systemState={deriveSystemState(CRISIS)} />);
    const volatility = tileFor(container, 'Volatility');
    const threat = tileFor(container, 'External Threat');
    expect(volatility.textContent).toContain('Critical');
    expect(volatility.textContent).not.toContain('Stable');
    expect(threat.textContent).toContain('Critical');
    expect(threat.textContent).not.toContain('Stable');
  });

  it('a calm settlement shows a GOOD band on the same dimensions (the other direction)', () => {
    const { container } = render(<SystemStateGrid systemState={deriveSystemState(CALM)} />);
    const volatility = tileFor(container, 'Volatility');
    expect(volatility.textContent).toContain('Stable');
    expect(volatility.textContent).not.toContain('Critical');
  });

  it('the tooltip repeats the same word, so hover and glance cannot disagree', () => {
    const { container } = render(<SystemStateGrid systemState={deriveSystemState(CRISIS)} />);
    expect(tileFor(container, 'Volatility').getAttribute('title')).toBe(
      'Volatility: Critical. Click for details.',
    );
  });

  it('resilience keeps its own direction — a crisis town bands it badly too (control)', () => {
    const { container } = render(<SystemStateGrid systemState={deriveSystemState(CRISIS)} />);
    const resilience = tileFor(container, 'Resilience');
    expect(resilience.textContent).toMatch(/Vulnerable|Critical/);
  });
});

describe('SubstrateTab — the Causes tab names the problem, not its opposite', () => {
  it('maximal crime reads RAMPANT, never COLLAPSED', () => {
    const { container } = render(<SubstrateTab settlement={CRISIS} />);
    const row = [...container.querySelectorAll('[data-substrate-row]')]
      .find(r => r.textContent.startsWith('Criminal opportunity'));
    expect(row, 'no Criminal opportunity row rendered').toBeTruthy();
    const pill = row.querySelector('[data-band]');
    // The MODEL band stays 'collapsed' on the data attribute (one machine
    // vocabulary); only the human word is re-phrased.
    expect(pill.getAttribute('data-band')).toBe('collapsed');
    expect(pill.textContent).toBe('Rampant');
    expect(row.textContent).not.toContain('collapsed');
  });

  it('a low-crime settlement reads the BENIGN word, never the raw band (other direction)', () => {
    // The second half of the same defect: the benign end fell through to the raw
    // band, so a town with no crime printed "Criminal opportunity · ADEQUATE",
    // which reads as the crime being adequate.
    const { container } = render(<SubstrateTab settlement={CALM} />);
    const row = [...container.querySelectorAll('[data-substrate-row]')]
      .find(r => r.textContent.startsWith('Criminal opportunity'));
    expect(row, 'no Criminal opportunity row rendered').toBeTruthy();
    const pill = row.querySelector('[data-band]');
    // The MODEL band is still the benign machine word on the data attribute.
    expect(['surplus', 'adequate']).toContain(pill.getAttribute('data-band'));
    expect(['Negligible', 'Contained']).toContain(pill.textContent);
    expect(row.textContent).not.toContain('adequate');
    expect(row.textContent).not.toContain('surplus');
    expect(container.textContent).not.toContain('Rampant');
    expect(container.textContent).not.toContain('Acute');
  });

  it('higher-is-better variables still print their raw band word (control)', () => {
    const { container } = render(<SubstrateTab settlement={CRISIS} />);
    const words = [...container.querySelectorAll('[data-band]')].map(n => n.textContent);
    // Every pill is either a raw band word or one of the five lower-is-better
    // words — nothing else may leak into the vocabulary.
    const legal = new Set([
      'surplus', 'adequate', 'strained', 'critical', 'collapsed',
      'Rampant', 'Acute', 'Elevated', 'Contained', 'Negligible',
    ]);
    for (const w of words) expect(legal.has(w), `illegal band word rendered: ${w}`).toBe(true);
    // And at least one pill still carries a raw (higher-is-better) word.
    expect(words.some(w => ['surplus', 'adequate', 'strained', 'critical', 'collapsed'].includes(w))).toBe(true);
  });

  it('sorts within a shared band by polarity-oriented severity', () => {
    const { container } = render(<SubstrateTab settlement={CRISIS} />);
    const rows = [...container.querySelectorAll('[data-substrate-row]')];
    const crimeIndex = rows.findIndex(r => r.textContent.startsWith('Criminal opportunity'));
    const legitimacyIndex = rows.findIndex(r => r.textContent.startsWith('Public legitimacy'));
    expect(crimeIndex).toBeGreaterThanOrEqual(0);
    expect(legitimacyIndex).toBeGreaterThanOrEqual(0);
    expect(rows[crimeIndex].querySelector('[data-band]').getAttribute('data-band')).toBe('collapsed');
    expect(rows[legitimacyIndex].querySelector('[data-band]').getAttribute('data-band')).toBe('collapsed');
    // Raw scores are crime=100 and legitimacy=10. Crime is lower-is-better, so
    // its health-oriented score is 0 and it belongs ahead of legitimacy.
    expect(crimeIndex).toBeLessThan(legitimacyIndex);
  });
});
