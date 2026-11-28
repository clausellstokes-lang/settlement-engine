/** @vitest-environment jsdom */
/**
 * tests/components/aboutCurrent.test.jsx — ABOUT-CURRENT (2026-11-10): the Practical
 * Guide's lists hold to the product's own registries.
 *
 * THE OWNER (2026-11-10): "What are your thoughts on the about page? Can you update it
 * so that it's current?" The Guide had kept the header's old seat names (Settlements,
 * World Map, ten times "Settlements tab") and a flat thirteen-tab list after the
 * dossier regrouped its tabs. These pins bind each list to the source the product
 * renders from, so the Guide cannot fall behind again silently:
 *   1. the Navigation seats are the route table's NAV, in its order, each described;
 *   2. the dossier tab list is OutputContainer.jsx :: TAB_GROUPS, both directions, with
 *      each label the dossier's own;
 *   3. the sharing entry says only what the share panel says, sentence by sentence.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NAV } from '../../src/lib/routes.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import HowToUse, { NAV_DESCRIPTIONS, DOSSIER_TAB_GROUPS, SHARE_ENTRY_SENTENCES } from '../../src/components/HowToUse.jsx';
import { TAB_GROUPS } from '../../src/components/OutputContainer.jsx';

afterEach(cleanup);

// The page's FAQ and the living-world rungs read a few store selectors; the same
// minimal anon mock tests/components/aboutSplit.test.jsx uses.
const storeState = { auth: { tier: 'anon' } };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

describe('ABOUT-CURRENT — the Navigation list is the header', () => {
  it('every header seat has a description and no description names a missing seat', () => {
    expect(Object.keys(NAV_DESCRIPTIONS).sort()).toEqual(NAV.map((n) => n.id).sort());
    for (const n of NAV) expect(NAV_DESCRIPTIONS[n.id], n.id).toBeTruthy();
  });

  it('the rendered Navigation rows carry the header labels in the header order', () => {
    const { container } = render(<HowToUse />);
    const nav = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Navigation');
    expect(nav, 'the Navigation sub-section renders').toBeTruthy();
    const labels = [...nav.parentElement.querySelectorAll('div > span:first-child')].map((s) => s.textContent);
    expect(labels.slice(0, NAV.length)).toEqual(NAV.map((n) => n.label));
  });

  it('the Guide no longer names the retired seat "Settlements tab"', () => {
    const { container } = render(<HowToUse />);
    const library = NAV.find((n) => n.id === 'settlements').label;
    // The anchor is the seat's own label in the same sentence frame: the page demonstrably
    // renders "<label> tab", so the old name's absence is a removal, not a vanished page.
    expectAbsentWithAnchor(container.textContent, 'Settlements tab', `${library} tab`, 'rendered Guide');
    const src = read('src/components/HowToUse.jsx');
    expectAbsentWithAnchor(src, 'Settlements tab', '{LIBRARY} tab', 'Guide source');
    expectAbsentWithAnchor(src, 'Settlements</strong> tab', '{LIBRARY}</strong> tab', 'Guide source, bold');
  });
});

describe('ABOUT-CURRENT — the dossier tab list is the dossier', () => {
  it('groups and tabs equal TAB_GROUPS exactly, in order (both directions)', () => {
    expect(DOSSIER_TAB_GROUPS.map((g) => g.group)).toEqual(Object.keys(TAB_GROUPS));
    for (const g of DOSSIER_TAB_GROUPS) {
      expect(g.label, g.group).toBe(TAB_GROUPS[g.group].label);
      expect(g.tabs.map(([id]) => id), g.group).toEqual([...TAB_GROUPS[g.group].tabs]);
    }
  });

  it("each label is the dossier's own label for that tab id", () => {
    const src = read('src/components/OutputContainer.jsx');
    for (const g of DOSSIER_TAB_GROUPS) {
      for (const [id, label] of g.tabs) {
        const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`id:\\s*'${id}',\\s*label:\\s*'${esc}'`);
        expect(re.test(src), `${id} → '${label}' is not the dossier's label`).toBe(true);
      }
    }
  });
});

describe('ABOUT-CURRENT — the sharing entry claims only what the share panel says', () => {
  it('every sentence appears verbatim in the share panel', () => {
    const panel = read('src/components/ShareToGallery.jsx').replace(/\s+/g, ' ');
    for (const sentence of SHARE_ENTRY_SENTENCES) {
      // The canon sentence is interpolated in the panel from the same copy key.
      const probe = sentence.replace(/^Start the World Clock /, '');
      expect(panel.includes(probe), sentence).toBe(true);
    }
  });

  it('the entry never says what players cannot see', () => {
    expect(SHARE_ENTRY_SENTENCES.length, 'the entry has sentences to read').toBeGreaterThan(0);
    for (const sentence of SHARE_ENTRY_SENTENCES) {
      const words = sentence.toLowerCase();
      for (const banned of ['cannot', "can't", 'never see']) {
        // The anchor is the sentence's own first word: the sentence is present and read.
        expectAbsentWithAnchor(words, banned, words.split(' ')[0], 'share entry sentence');
      }
    }
  });
});

describe('ABOUT-CURRENT A4 — the FAQ states the Founders\' Hall count from its constant (ruling S8)', () => {
  it('the founder answer renders the seat cap through t(), never a typed count', async () => {
    const { t } = await import('../../src/copy/index.js');
    const { FOUNDER_SEATS } = await import('../../src/config/tierFacts.js');
    expect(t('accountFaq.founderLifetime.a', { seats: FOUNDER_SEATS })).toContain(`holds ${FOUNDER_SEATS} chairs`);
    expect(read('src/components/account/AccountFAQ.jsx')).toMatch(/ANSWER_VARS = Object\.freeze\(\{ seats: FOUNDER_SEATS \}\)/);
    expectAbsentWithAnchor(read('src/copy/en.js'), 'Hall holds thirty chairs', 'Hall holds {seats} chairs', 'founder answer');
  });
});
