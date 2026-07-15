/** @vitest-environment jsdom */
// Regression: the Economy anchor card used to paint prosperity via hand-typed
// string matches (prosperous / comfortable / subsistence), so every other band
// — critically Wealthy (the BEST band) and Moderate (the middle) — fell through
// to danger red #8b1a1a. The fix ranks on the canonical PROSPERITY_TIERS
// vocabulary. Top bands must be green, mid amber; only the genuinely low bands
// get red.
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';

afterEach(cleanup);

const GREEN = '#1a5a28';   // Prosperous, Wealthy
const AMBER = '#a0762a';   // Moderate, Comfortable
const BROWN = '#8a4010';   // Struggling, Poor
const RED   = '#8b1a1a';   // Subsistence / unknown — the danger colour

function town(prosperity) {
  return {
    id: 's1',
    name: 'Testburg',
    population: 1200,
    config: {},
    institutions: [],
    powerStructure: { factions: [] },
    economicState: { prosperity, foodSecurity: { deficitPct: 0 }, safetyProfile: {} },
    activeConditions: [],
  };
}

// Find the "Economy" anchor card and read its resolved left-border colour.
function economyAccent(container) {
  const label = [...container.querySelectorAll('div')]
    .find(d => (d.textContent || '').trim().toUpperCase() === 'ECONOMY');
  expect(label, 'Economy label present').toBeTruthy();
  const card = label.closest('div[style]')?.parentElement || label.parentElement;
  // The label's own inline color echoes the accent; the card border-left too.
  return {
    labelColor: label.style.color,
    cardBorderLeft: card.style.borderLeft || card.style.borderLeftColor,
  };
}

// jsdom serializes inline colours as `rgb(r, g, b)`; normalize any hex or rgb
// string to a canonical `r,g,b` triple so assertions are format-agnostic.
function normalize(v) {
  const s = (v || '').trim().toLowerCase();
  const hex = s.match(/^#([0-9a-f]{6})$/);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }
  const rgb = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) return `${+rgb[1]},${+rgb[2]},${+rgb[3]}`;
  return s;
}

describe('DailyLifeTab — Economy prosperity colour ranks the whole vocabulary', () => {
  test('Wealthy (best band) is green, NOT danger red', () => {
    const { container } = render(<DailyLifeTab settlement={town('Wealthy')} />);
    const { labelColor } = economyAccent(container);
    expect(normalize(labelColor)).toBe(normalize(GREEN));
    expect(normalize(labelColor)).not.toBe(normalize(RED));
  });

  test('Prosperous is green', () => {
    const { container } = render(<DailyLifeTab settlement={town('Prosperous')} />);
    expect(normalize(economyAccent(container).labelColor)).toBe(normalize(GREEN));
  });

  test('Comfortable is amber', () => {
    const { container } = render(<DailyLifeTab settlement={town('Comfortable')} />);
    expect(normalize(economyAccent(container).labelColor)).toBe(normalize(AMBER));
  });

  test('Moderate (middle band) is amber, NOT danger red', () => {
    const { container } = render(<DailyLifeTab settlement={town('Moderate')} />);
    const { labelColor } = economyAccent(container);
    expect(normalize(labelColor)).toBe(normalize(AMBER));
    expect(normalize(labelColor)).not.toBe(normalize(RED));
  });

  test('Poor is brown (warning, not full danger)', () => {
    const { container } = render(<DailyLifeTab settlement={town('Poor')} />);
    expect(normalize(economyAccent(container).labelColor)).toBe(normalize(BROWN));
  });

  test('Struggling is brown', () => {
    const { container } = render(<DailyLifeTab settlement={town('Struggling')} />);
    expect(normalize(economyAccent(container).labelColor)).toBe(normalize(BROWN));
  });

  test('Subsistence is danger red', () => {
    const { container } = render(<DailyLifeTab settlement={town('Subsistence')} />);
    expect(normalize(economyAccent(container).labelColor)).toBe(normalize(RED));
  });

  test('Unknown/unrecognized band falls back to danger red', () => {
    const { container } = render(<DailyLifeTab settlement={town('Flourishing')} />);
    expect(normalize(economyAccent(container).labelColor)).toBe(normalize(RED));
  });
});
