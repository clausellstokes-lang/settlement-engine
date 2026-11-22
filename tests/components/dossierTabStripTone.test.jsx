/** @vitest-environment jsdom */
/**
 * dossierTabStripTone.test.jsx — THE LAUNCH SKIN ON BOTH STRIPS (THE OWNER, 2026-11-01,
 * ODQ §934.103: "a purpleish hue just for distinction" → "Purple hue with gold lettering" →
 * "a regal purple dark with a gloss and shimmering gold lettering just to give the feel that it
 * is in fact till launch" — X-39).
 *
 * A tab entry carrying `tone: 'launch'` wears the regal ground with shimmering gold letters on
 * the desktop strip and on the phone strip alike, idle and lit; the lit one carries the gold
 * rule. A tab without the tone keeps the simulation's own colours — asserted on the same
 * render, so the absence is anchored on the presence. The pairs are pinned in
 * tests/design/contrast.test.js; the skin itself is the one in design/tokens.js :: launchSkin.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import DossierTabStrip from '../../src/components/dossier/DossierTabStrip.jsx';
import MobileTabStrip from '../../src/components/primitives/MobileTabStrip.jsx';
import { GOLD_DEEP, launchSkin } from '../../src/components/theme.js';
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
/** jsdom keeps a gradient background as the author wrote it. */
/** jsdom re-serialises the colours inside a gradient; read a value back the same way. */
function cssBackground(value) {
  const el = document.createElement('div');
  el.style.background = value;
  return el.style.background || el.style.backgroundImage;
}
const ground = (el) => el.style.background || el.style.backgroundImage;
const GROUND = () => cssBackground(launchSkin.ground);
const SHIMMER = () => cssBackground(launchSkin.shimmer.backgroundImage);

function expectLaunchTab(tab, { lit }) {
  expect(tab.getAttribute('data-tone')).toBe('launch');
  expect(ground(tab)).toBe(GROUND());
  expect(hex(tab.style.color)).toBe(hex(cssColor(launchSkin.ink)));
  const ink = tab.querySelector('[data-launch-ink]');
  expect(ink, 'the label shimmers on its own span').toBeTruthy();
  expect(cssBackground(ink.style.backgroundImage)).toBe(SHIMMER());
  expect(ink.style.animation).toContain('sf-goldShimmer');
  if (lit) expect(tab.style.borderBottom).toContain(cssColor(launchSkin.rule));
  else expect(tab.style.borderBottom).toContain('transparent');
}

describe('the desktop strip', () => {
  it('wears the regal ground with shimmering gold letters on a launch tab, idle and lit, and leaves the live tab alone', () => {
    render(<DossierTabStrip scroll={() => {}} scrollRef={{ current: null }} tabs={TABS} selectedTab="war" setActiveTab={() => {}} />);
    const war = screen.getByRole('tab', { name: 'War' });
    const rumors = screen.getByRole('tab', { name: 'Rumors & News' });
    const history = screen.getByRole('tab', { name: 'History' });
    expectLaunchTab(war, { lit: true });
    expectLaunchTab(rumors, { lit: false });
    // the live tab keeps its own ink, ground and label
    expect(history.getAttribute('data-tone')).toBeNull();
    expect(ground(history)).not.toBe(GROUND());
    expect(hex(history.style.color)).not.toBe(hex(cssColor(launchSkin.ink)));
    expect(history.querySelector('[data-launch-ink]')).toBeNull();
  });
});

describe('the phone strip', () => {
  it('wears the regal ground with shimmering gold letters on a launch tab, idle and lit, and leaves the live tab alone', () => {
    render(<MobileTabStrip tabs={TABS} value="rumors" onChange={() => {}} ariaLabel="Dossier tabs" />);
    const war = screen.getByRole('tab', { name: 'War' });
    const rumors = screen.getByRole('tab', { name: 'Rumors & News' });
    const history = screen.getByRole('tab', { name: 'History' });
    expectLaunchTab(rumors, { lit: true });
    expectLaunchTab(war, { lit: false });
    expect(history.getAttribute('data-tone')).toBeNull();
    expect(ground(history)).not.toBe(GROUND());
    expect(hex(history.style.color)).not.toBe(hex(cssColor(launchSkin.ink)));
    expect(hex(history.style.color)).not.toBe(hex(cssColor(GOLD_DEEP))); // idle live tab is muted, not gold
    expect(history.querySelector('[data-launch-ink]')).toBeNull();
  });
});

/** jsdom serialises hex colours as rgb(); normalise a token to the same form. */
function cssColor(token) {
  const el = document.createElement('div');
  el.style.color = token;
  return el.style.color;
}
