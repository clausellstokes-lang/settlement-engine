/** @vitest-environment jsdom */
/**
 * dossierTabStripTone.test.jsx — THE LAUNCH REGISTER ON BOTH STRIPS (THE OWNER, 2026-11-01,
 * ODQ §934.103: the teaser tabs "give them a purpleish hue just for distinction", then
 * "Purple hue with gold lettering if that helps" — X-36).
 *
 * A tab entry carrying `tone: 'launch'` reads in the launch register on the desktop strip
 * and on the phone strip alike: at rest the launch wash with gold-800 letters under a launch
 * rule, lit the deep launch fill with gold-400 letters under a gold rule. A tab without the
 * tone keeps the simulation's own colours — asserted on the same render, so the absence is
 * anchored on the presence. The contrast of each pair is pinned in tests/design/contrast.test.js.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import DossierTabStrip from '../../src/components/dossier/DossierTabStrip.jsx';
import MobileTabStrip from '../../src/components/primitives/MobileTabStrip.jsx';
import {
  GOLD, GOLD_DEEP, LAUNCH, LAUNCH_DEEP, LAUNCH_BG, LAUNCH_INK, LAUNCH_INK_IDLE,
} from '../../src/components/theme.js';
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
  it('paints a launch-toned tab purple with gold letters, idle and active, and leaves the live tab alone', () => {
    render(<DossierTabStrip scroll={() => {}} scrollRef={{ current: null }} tabs={TABS} selectedTab="war" setActiveTab={() => {}} />);
    const war = screen.getByRole('tab', { name: 'War' });
    const rumors = screen.getByRole('tab', { name: 'Rumors & News' });
    const history = screen.getByRole('tab', { name: 'History' });
    expect(war.getAttribute('data-tone')).toBe('launch');
    expect(rumors.getAttribute('data-tone')).toBe('launch');
    expect(history.getAttribute('data-tone')).toBeNull(); // anchored: the two launch tabs carry the attribute on this render
    // the ACTIVE launch tab: gold letters on the deep launch fill, under a gold rule
    expect(hex(war.style.color)).toBe(hex(cssColor(LAUNCH_INK)));
    expect(hex(war.style.background)).toBe(hex(cssColor(LAUNCH_DEEP)));
    expect(war.style.borderBottom).toContain(cssColor(GOLD));
    // the IDLE launch tab: gold letters on the launch wash
    expect(hex(rumors.style.color)).toBe(hex(cssColor(LAUNCH_INK_IDLE)));
    expect(hex(rumors.style.background)).toBe(hex(cssColor(LAUNCH_BG)));
    // the live tab keeps its own ink and no wash
    expect(hex(history.style.color)).not.toBe(hex(cssColor(LAUNCH_INK_IDLE)));
    expect(hex(history.style.background)).not.toBe(hex(cssColor(LAUNCH_BG)));
  });
});

describe('the phone strip', () => {
  it('paints a launch-toned tab purple with gold letters, idle and active, and leaves the live tab alone', () => {
    render(<MobileTabStrip tabs={TABS} value="rumors" onChange={() => {}} ariaLabel="Dossier tabs" />);
    const war = screen.getByRole('tab', { name: 'War' });
    const rumors = screen.getByRole('tab', { name: 'Rumors & News' });
    const history = screen.getByRole('tab', { name: 'History' });
    expect(rumors.getAttribute('data-tone')).toBe('launch');
    expect(war.getAttribute('data-tone')).toBe('launch');
    expect(history.getAttribute('data-tone')).toBeNull(); // anchored: as above
    // the ACTIVE launch tab: gold letters on the deep launch fill, under the strip's gold rule
    expect(hex(rumors.style.color)).toBe(hex(cssColor(LAUNCH_INK)));
    expect(hex(rumors.style.background)).toBe(hex(cssColor(LAUNCH_DEEP)));
    expect(rumors.style.borderBottom).toContain(cssColor(GOLD));
    // the IDLE launch tab: gold letters on the launch wash under a launch rule
    expect(hex(war.style.color)).toBe(hex(cssColor(LAUNCH_INK_IDLE)));
    expect(hex(war.style.background)).toBe(hex(cssColor(LAUNCH_BG)));
    expect(war.style.borderBottom).toContain(cssColor(LAUNCH));
    // the idle live tab is muted, not gold, and carries no wash
    expect(hex(history.style.color)).not.toBe(hex(cssColor(LAUNCH_INK_IDLE)));
    expect(hex(history.style.color)).not.toBe(hex(cssColor(GOLD_DEEP)));
    expect(hex(history.style.background)).not.toBe(hex(cssColor(LAUNCH_BG)));
  });
});

/** jsdom serialises hex colours as rgb(); normalise a token to the same form. */
function cssColor(token) {
  const el = document.createElement('div');
  el.style.color = token;
  return el.style.color;
}
