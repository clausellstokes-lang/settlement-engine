/** @vitest-environment jsdom */
/**
 * tests/components/tierStockImageCards.test.jsx — EVERY CARD THAT SHOWS A
 * SETTLEMENT SHOWS ONE, AND THE OWNER'S PICTURE STILL WINS.
 *
 * Owner order ODQ §934.32: the stock tier paintings "should be the default image
 * when they are shared on the gallery and our landing page until an owner
 * replaces that image."
 *
 * ⛔ WHY A TEST PER SURFACE AND NOT ONE TEST OF THE HELPER. The helper is pinned
 * on its own (tests/domain/tierStockImage.test.js) and that proves nothing about
 * the cards: the defect this order cures was never a wrong URL, it was FOUR
 * surfaces that each answered "no owner image" differently — an initial on a
 * gradient, a private six-to-three backdrop map, and twice nothing at all. A
 * surface that quietly keeps its old empty state is exactly the regression, and
 * only a render of that surface can see it.
 *
 * Each surface therefore gets BOTH arms, because they fail for different reasons:
 *   • no owner image → the tier's painting is in the DOM;
 *   • an owner image → the owner's URL is in the DOM and the painting is not.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { TIER_STOCK_IMAGES, tierStockImage } from '../../src/domain/display/tierStockImage.js';
import { SAMPLE_SETTLEMENTS } from '../../src/data/sampleSettlements.js';
import GalleryImage from '../../src/components/gallery/GalleryImage.jsx';
import { SampleCard } from '../../src/components/settlements/SampleCard.jsx';

const store = {
  generateSettlement: vi.fn(async () => ({ name: 'Forged', tier: 'village' })),
  updateConfig: vi.fn(),
  auth: { tier: 'premium', user: { id: 'u1' } },
  lastRefusal: null,
  clearRefusal: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(store); }
  useStore.getState = () => store;
  useStore.subscribe = () => () => {};
  return { useStore };
});

function installMatchMedia() {
  window.matchMedia = vi.fn((q) => ({
    media: q, matches: false,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
}

afterEach(cleanup);

/** Every <img> src on the page, plus every CSS background-image url(). */
function paintedSources(container) {
  const out = [...container.querySelectorAll('img')].map((img) => img.getAttribute('src') || '');
  for (const el of container.querySelectorAll('*')) {
    const bg = el.style?.backgroundImage || '';
    const m = bg.match(/url\((['"]?)(.*?)\1\)/);
    if (m) out.push(m[2]);
  }
  return out.filter(Boolean);
}

describe('the gallery card', () => {
  test('a shared town with no owner image wears its tier’s painting', () => {
    const { container } = render(<GalleryImage item={{ name: 'Oakmere', tier: 'town' }} />);
    // A town wears the VILLAGE painting under the owner's pairing.
    expect(paintedSources(container)).toContain(TIER_STOCK_IMAGES.village);
    // And the alt text does not claim the picture is OF this town.
    const img = container.querySelector('img');
    expect(img.getAttribute('alt')).toMatch(/of the kind/i);
    expect(img.getAttribute('loading'), 'the card image is not lazy').toBe('lazy');
  });

  test('the owner’s own image wins the moment they supply one', () => {
    const own = 'https://cdn.example/oakmere.jpg';
    const { container } = render(
      <GalleryImage item={{ name: 'Oakmere', tier: 'town', imageUrl: own, imageAlt: 'The harbour at dusk' }} />,
    );
    const painted = paintedSources(container);
    expect(painted).toContain(own);
    // anchored: the line above asserts the owner's URL IS in `painted` on this same render, so the collection is provably live and correctly shaped
    expect(painted, 'the stock painting overrode the owner’s image').not.toContain(TIER_STOCK_IMAGES.village);
    expect(container.querySelector('img').getAttribute('alt')).toBe('The harbour at dusk');
  });

  test('a row with NO tier keeps the initial plate rather than guessing one', () => {
    // anchored: the two arms above prove this component does render an <img>
    // when it can, so an absent <img> here is a deliberate refusal and not a
    // dead render.
    const { container } = render(<GalleryImage item={{ name: 'Nowhere' }} />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('N')).toBeTruthy();
  });
});

describe('the curated sample cards', () => {
  test('the Library shelf card carries its tier’s painting', () => {
    const sample = SAMPLE_SETTLEMENTS.find((s) => s.tier === 'village');
    expect(sample, 'no village sample to render — the curated trio changed').toBeTruthy();
    const { container } = render(<SampleCard sample={sample} onFork={() => {}} forking={false} />);
    expect(paintedSources(container)).toContain(tierStockImage(sample.tier));
    expect(container.querySelector('img').getAttribute('loading')).toBe('lazy');
  });

  test('the /create strip gives every curated sample a painting', async () => {
    installMatchMedia();
    vi.resetModules();
    const FoundingWorlds = (await import('../../src/components/generate/FoundingWorlds.jsx')).default;
    const { container } = render(<FoundingWorlds onNavigate={() => {}} />);
    const painted = paintedSources(container);
    // ANTI-VACUITY: the trio must actually be on screen.
    expect(SAMPLE_SETTLEMENTS.length).toBe(3);
    for (const sample of SAMPLE_SETTLEMENTS) {
      expect(screen.getByText(sample.name), `missing card: ${sample.name}`).toBeTruthy();
      expect(painted, `${sample.name} has no tier painting`).toContain(tierStockImage(sample.tier));
    }
    // The strip's cards are the landing's commons fallback too (one component,
    // two mounts), so proving it here proves it there.
    expect(container.querySelectorAll('img').length).toBe(SAMPLE_SETTLEMENTS.length);
  });
});
