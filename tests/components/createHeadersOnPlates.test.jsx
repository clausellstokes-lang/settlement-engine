/** @vitest-environment jsdom */
/**
 * createHeadersOnPlates.test.jsx — NO BARE TEXT ON THE PAINTING BEFORE GENERATION.
 *
 * The owner, 2026-11-10, verbatim: "Next thing. The section headers for the configuration
 * before generating a settlement are hard to read."
 *
 * The Create page wears `.page-bg.is-flow` — a painting under a cream veil of 0.49–0.56.
 * The configuration's section headers ("1 · Foundations", "2 · Institutions, services &
 * trade", "Exact seed"), their MUTED subtitles, the opening block (kicker, title, lead) and
 * "Founding Worlds" with its lead were set BARE on that painting, in the gaps between cards:
 * the subtitles measured 1.03–2.33:1 against what was painted behind them, the kicker
 * 1.8–3.7:1 (docs/chair/2026-11-10/CONFIG-HEADERS-2026-11-10.md has the table). The house
 * already stated the rule beside `.page-painted` in src/index.css: "bare header text is never
 * scanned through texture".
 *
 * THE RULE PINNED HERE: inside the pre-generation configuration (the opening block and the
 * whole layered panel, Advanced on a desktop — the widest render) and the Founding Worlds
 * header, EVERY text node has, between it and the page, an element painted with an opaque
 * house surface (CARD, CARD_HDR, PARCH, CARD_ALT, or the Character card's parchment swatch).
 * The walk stops at the surface under test, so the painted page itself can never count.
 *
 * Anchored, never vacuous: the walk must visit the named headers and subtitles (a render that
 * lost them would otherwise pass over nothing), and at least a floor of text nodes.
 * Red on the base (ecadf531a): every one of those headers and subtitles had no surface.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: {}, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

const S = vi.hoisted(() => ({ state: null }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(S.state);
  useStore.getState = () => S.state;
  useStore.setState = () => {};
  useStore.subscribe = () => () => {};
  return { useStore };
});

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CARD, CARD_HDR, PARCH, CARD_ALT, swatch } from '../../src/components/theme.js';
import GenerateWizard from '../../src/components/GenerateWizard.jsx';
import FoundingWorlds from '../../src/components/generate/FoundingWorlds.jsx';

function baseState() {
  return {
    config: { ...DEFAULT_CONFIG },
    updateConfig: vi.fn(),
    settlement: null,
    wizardMode: 'advanced',
    setWizardMode: vi.fn(),
    setWizardStep: vi.fn(),
    auth: { tier: 'premium', role: 'user', user: { id: 'u1' } },
    canSave: () => true,
    canUseCustomContent: () => true,
    getCustomContentCount: () => 0,
    canCustomizePreGeneration: () => true,
    isTierAllowed: () => true,
    lastSeed: null,
    lastRefusal: null,
    clearRefusal: vi.fn(),
    generateSettlement: vi.fn(),
    setRandomSliderMode: vi.fn(),
    setCustomSlidersExplicit: vi.fn(),
    randomSliderMode: false,
    customSlidersExplicit: false,
    campaigns: [],
    customContent: {},
    institutionToggles: {},
    categoryToggles: {},
    goodsToggles: {},
    servicesToggles: {},
    resetAllToggles: vi.fn(),
    clearLoadedFromSave: vi.fn(),
    clearNeighbour: vi.fn(),
    clearSettlement: vi.fn(),
    pipelineRevealActive: false,
    dismissPipelineReveal: vi.fn(),
  };
}

/** The house surfaces, normalised through the same CSS parser the elements use. */
function surfaceSet() {
  const probe = document.createElement('div');
  return new Set([CARD, CARD_HDR, PARCH, CARD_ALT, swatch['#F7F0E4']].map((hex) => {
    probe.style.backgroundColor = '';
    probe.style.backgroundColor = hex;
    return probe.style.backgroundColor;
  }));
}

/**
 * Two house surfaces that are painted by a CLASS (jsdom does not apply the stylesheet), each
 * recognised strictly: a Button primitive (`.sf-btn`) whose variant fill is not transparent
 * (a ghost button paints nothing, and must not count), and the house's readable strip
 * (`.sf-readable-strip`, src/index.css: CARD at 0.92 behind a hairline — the Generate
 * button's subline wears it).
 */
function paintsItsOwnPlate(el) {
  if (el.classList.contains('sf-readable-strip')) return true;
  if (!el.classList.contains('sf-btn')) return false;
  const fill = el.style.getPropertyValue('--sf-btn-bg').trim();
  return fill !== '' && fill !== 'transparent';
}

/** Every non-blank text node under `root` whose nearest house surface is NOT inside `root`. */
function bareTexts(root) {
  const surfaces = surfaceSet();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const visited = [];
  const bare = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    if (!text) continue;
    visited.push(text);
    let el = node.parentElement;
    let onPlate = false;
    while (el && el !== root.parentElement) {
      if (surfaces.has(el.style.backgroundColor) || paintsItsOwnPlate(el)) { onPlate = true; break; }
      el = el.parentElement;
    }
    if (!onPlate) bare.push(text);
  }
  return { visited, bare };
}

afterEach(() => { cleanup(); });

describe('the configuration before generation: no bare text on the painting', () => {
  test('Advanced, desktop: the opening block and every header, subtitle and label stand on a house surface', () => {
    S.state = baseState();
    const { container } = render(<GenerateWizard isMobile={false} />);
    // The surface under test is the pre-generation stage: everything above the Generate
    // button that the wizard draws (the ChangeModeBar onward). Its root is the wizard's own
    // column, the first element in the render.
    const root = container.firstElementChild;
    const { visited, bare } = bareTexts(root);
    // anchored: the walk reached the headers this rule is about.
    for (const must of [
      'Create a settlement', 'Exact seed', 'reproduce a world: every dial rolls from the seed',
      'Character', 'Pick a settlement archetype to shape it in one tap',
      '1 · Foundations', 'size, route, culture: the essentials',
      '2 · Institutions, services & trade', 'force or forbid specifics', 'nothing forced or forbidden yet',
      'Place in Region', 'Ready to generate',
    ]) {
      expect(visited, `the render never drew "${must}"`).toContain(must);
    }
    expect(visited.length, 'the walk visited too few text nodes to mean anything').toBeGreaterThanOrEqual(60);
    expect(bare, 'text stands bare on the painted page').toEqual([]);
  });

  test('Founding Worlds: the heading and its lead stand on a plate', () => {
    S.state = baseState();
    const { container } = render(<FoundingWorlds onNavigate={() => {}} />);
    const { visited, bare } = bareTexts(container.firstElementChild);
    expect(visited).toContain('Founding Worlds');
    expect(visited.some((t) => t.startsWith('Start somewhere already alive'))).toBe(true);
    // anchored: the two lines above are proven visited on this render.
    expect(bare, 'text stands bare on the painted page').toEqual([]);
  });
});
