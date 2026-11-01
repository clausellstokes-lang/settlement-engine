/** @vitest-environment jsdom */
/**
 * dossierTabStripTone.test.jsx — THE LAUNCH HUE ON BOTH STRIPS (THE OWNER, 2026-11-01,
 * ODQ §934.103: the teaser tabs "give them a purpleish hue just for distinction").
 *
 * A tab entry carrying `tone: 'launch'` reads in the launch register on the desktop strip
 * and on the phone strip alike, and a tab without the tone keeps the simulation's own
 * colours — asserted on the same render, so the absence is anchored on the presence.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import DossierTabStrip from '../../src/components/dossier/DossierTabStrip.jsx';
import MobileTabStrip from '../../src/components/primitives/MobileTabStrip.jsx';
import { LAUNCH, LAUNCH_DEEP, LAUNCH_BG, GOLD_DEEP } from '../../src/components/theme.js';
import { LAUNCH_TONE } from '../../src/domain/dossier/launchTeasers.js';

const Icon = () => <svg aria-hidden="true" />;
const TABS = [
  { id: 'history', label: 'History', Icon },
  { id: 'rumors', label: 'Rumors & News', Icon, tone: LAUNCH_TONE },
  { id: 'war', label: 'War', Icon, tone: LAUNCH_TONE },
];

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});
afterEach(() => cleanup());

const hex = (s) => String(s).toLowerCase();

describe('the desktop strip', () => {
  it('paints a launch-toned tab purple, idle and active, and leaves the live tab alone', () => {
    render(<DossierTabStrip scroll={() => {}} scrollRef={{ current: null }} tabs={TABS} selectedTab="war" setActiveTab={() => {}} />);
    const war = screen.getByRole('tab', { name: 'War' });
    const rumors = screen.getByRole('tab', { name: 'Rumors & News' });
    const history = screen.getByRole('tab', { name: 'History' });
    expect(war.getAttribute('data-tone')).toBe('launch');
    expect(rumors.getAttribute('data-tone')).toBe('launch');
    expect(history.getAttribute('data-tone')).toBeNull(); // anchored: the two launch tabs carry the attribute on this render
    // the active launch tab: the deep launch label on the launch wash, underlined in it
    expect(hex(war.style.color)).toBe(hex(cssColor(LAUNCH_DEEP)));
    expect(hex(war.style.background)).toBe(hex(cssColor(LAUNCH_BG)));
    expect(war.style.borderBottom).toContain(cssColor(LAUNCH_DEEP));
    // the idle launch tab: the launch hue as its label
    expect(hex(rumors.style.color)).toBe(hex(cssColor(LAUNCH)));
    // the live tab keeps its own ink
    expect(hex(history.style.color)).not.toBe(hex(cssColor(LAUNCH)));
  });
});

describe('the phone strip', () => {
  it('paints a launch-toned tab purple, idle and active, and leaves the live tab alone', () => {
    render(<MobileTabStrip tabs={TABS} value="rumors" onChange={() => {}} ariaLabel="Dossier tabs" />);
    const war = screen.getByRole('tab', { name: 'War' });
    const rumors = screen.getByRole('tab', { name: 'Rumors & News' });
    const history = screen.getByRole('tab', { name: 'History' });
    expect(rumors.getAttribute('data-tone')).toBe('launch');
    expect(war.getAttribute('data-tone')).toBe('launch');
    expect(history.getAttribute('data-tone')).toBeNull(); // anchored: as above
    expect(hex(rumors.style.color)).toBe(hex(cssColor(LAUNCH_DEEP)));
    expect(hex(rumors.style.background)).toBe(hex(cssColor(LAUNCH_BG)));
    expect(rumors.style.borderBottom).toContain(cssColor(LAUNCH));
    expect(hex(war.style.color)).toBe(hex(cssColor(LAUNCH)));
    expect(hex(history.style.color)).not.toBe(hex(cssColor(LAUNCH)));
    expect(hex(history.style.color)).not.toBe(hex(cssColor(GOLD_DEEP))); // idle live tab is muted, not gold
  });
});

/** jsdom serialises hex colours as rgb(); normalise a token to the same form. */
function cssColor(token) {
  const el = document.createElement('div');
  el.style.color = token;
  return el.style.color;
}
