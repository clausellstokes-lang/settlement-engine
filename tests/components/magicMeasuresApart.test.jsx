/** @vitest-environment jsdom */
/**
 * magicMeasuresApart.test.jsx — PAGE-1 MAGIC (F3c): "Reliance on magic: Relied upon" beside "Magical Capability: Weak".
 *
 * Two honest measures (the build's measure, docs/chair/2026-11-20/content/page/build/MAGIC/measure.out.txt): reliance
 * counts what depends on magic (the clergy's "Divine & Magical Healing" among it, a chain the generator gates on magic);
 * capability is the defence's magic part (the magic dial, the magic houses, the land; nothing in a small place with no
 * arcane house). On the chair's 300 they sat two steps or more apart in 26 towns with nothing on the page to say why.
 *
 * THE GUARD, over the born pool as the page renders it (no leaf is imported: the words are read off the DOM):
 *   1. On the Overview, wherever the reliance word and the capability bar's word sit on opposite sides (Relied upon or
 *      Integral beside Weak or Critical; None or Present beside Adequate or Strong: B's pairs two steps or more apart),
 *      the reliance tag carries ONE line saying what each counts; everywhere else it carries none.
 *   2. The line names what the town leans on in the Magic tab's own words (its "· for …" list), and the capability in
 *      the bar's own word, spoken plainly.
 *   3. The Magic tab's headline stays one word (T2-26) and a caption above it says it is the world's measure, not the
 *      town's; a dead-magic world prints its sentence with no caption.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SIZES } from './pageCensusWalk.shared.mjs';

afterEach(cleanup);

/** The chair's 300 (measureA's recipe): SIZES x 0..49, seed `hxd-<size>-<i>`, DEFAULT_CONFIG untouched. */
/** @type {Array<{ seed: string, t: any }>} */ const POOL = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 50; i++) {
    const seed = `hxd-${size}-${i}`;
    POOL.push({ seed, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, 600_000);

const RELIES = ['relied upon', 'integral'];
const STRONG = ['adequate', 'strong'];
const PLAIN = /** @type {Record<string, string>} */ ({ critical: 'very weak', weak: 'weak', adequate: 'fair', strong: 'strong' });

/** @param {any} t */
function overviewRead(t) {
  const { container, unmount } = render(<OverviewTab settlement={t} />);
  const tag = container.querySelector('[data-testid="overview-magic-reliance"]');
  const reliance = (tag?.children[1]?.textContent || '').trim().toLowerCase();
  const capLabel = [...container.querySelectorAll('span')].find((s) => s.textContent === 'Magical Capability');
  const capability = (capLabel?.nextElementSibling?.textContent || '').trim().toLowerCase();
  const line = tag?.querySelector('[data-testid="overview-magic-apart"]')?.textContent ?? null;
  const lines = container.querySelectorAll('[data-testid="overview-magic-apart"]').length;
  unmount();
  return { reliance, capability, line, lines };
}

/** @param {any} t */
function magicTabRead(t) {
  const { container, unmount } = render(<MagicTab settlement={t} />);
  const forText = container.querySelector('[data-testid="magic-reliance-for"]')?.textContent || '';
  const head = container.querySelector('[data-testid="magic-tab"] > p')?.textContent ?? null;
  const scope = container.querySelector('[data-testid="magic-headline-scope"]')?.textContent ?? null;
  unmount();
  return { relyFor: forText.replace(/^ · for /, ''), head, scope };
}

describe('PAGE-1 MAGIC: where reliance and capability sit apart, the Overview says what each counts', () => {
  test('the 300: a line exactly where the two words sit on opposite sides, in the page\'s own words', () => {
    let apart = 0; let lined = 0;
    /** @type {string[]} */ const failures = [];
    for (const { seed, t } of POOL) {
      const o = overviewRead(t);
      if (!o.reliance || !o.capability) { failures.push(`${seed}: a magic word is missing (${o.reliance} | ${o.capability})`); continue; }
      const relies = RELIES.includes(o.reliance);
      const opposite = relies ? !STRONG.includes(o.capability) : STRONG.includes(o.capability);
      if (opposite) apart += 1;
      if (o.line) lined += 1;
      if (o.lines > 1) failures.push(`${seed}: ${o.lines} lines`);
      if (!opposite) { if (o.line) failures.push(`${seed}: a line where the two agree: ${o.line}`); continue; }
      if (!o.line) { failures.push(`${seed}: ${o.reliance} beside ${o.capability}, and no line`); continue; }
      const want = relies
        ? `The ${t.tier} leans on magic for ${magicTabRead(t).relyFor}, but its arcane strength is ${PLAIN[o.capability]}.`
        : `Nothing in the ${t.tier} depends on magic, though its arcane strength is ${PLAIN[o.capability]}.`;
      if (o.line !== want) failures.push(`${seed}: "${o.line}" ≠ "${want}"`);
    }
    expect(failures).toEqual([]);
    // The liveness anchor: B measured 26 of the 300 two steps or more apart (f3.out.txt §c); the guard saw them all.
    expect(apart).toBe(26);
    expect(lined).toBe(apart);
  }, 600_000);

  test('the Magic tab: the headline stays one word, under a caption that says it is the world\'s measure', () => {
    /** @type {string[]} */ const failures = [];
    for (const { seed, t } of POOL) {
      const m = magicTabRead(t);
      if (!m.head || m.head.split(/\s+/).length !== 1) failures.push(`${seed}: headline "${m.head}"`);
      if (m.scope !== `Magic in the world at large, not the ${t.tier}'s own:`) failures.push(`${seed}: caption "${m.scope}"`);
    }
    expect(failures).toEqual([]);
    const dead = magicTabRead({ ...POOL[0].t, config: { ...POOL[0].t.config, magicExists: false } });
    expect(dead.head).toBe('Magic does not function in this world');
    expect(dead.scope).toBeNull();
  }, 600_000);
});
