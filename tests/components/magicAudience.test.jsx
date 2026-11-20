/** @vitest-environment jsdom */
/**
 * magicAudience.test.jsx — PAGE-4 MAGIC-AUDIENCE: the chair's three conditions (14:29 UTC) on MAGIC's Overview line
 * (`magicMeasuresApart.js :: magicMeasuresApartLine`, the note under "Reliance on magic", testid overview-magic-apart).
 * "the Overview line may print to EVERY audience ON THREE CONDITIONS, each a test at your merge: it is composed only
 * from the document in hand; for each audience the chains it names are a subset of the chains that same audience's
 * Magic tab prints; and it is in your hand-back's list for the security reader at the join."
 *
 * (a) THE DOCUMENT IN HAND: the line is a pure function of the document it is given (no store read, no second
 *     source): the same document twice, or a copy of it, gives the same line; a frozen document is not written; a
 *     document stripped of its chains names none of them.
 * (b) EVERY AUDIENCE: the page hands the Overview and the Magic tab the SAME document and the SAME two flags
 *     (OutputContainer.jsx: `publicDossier`, `playerView`); a public gallery page's document is `toPublicSafe(record)`.
 *     For the owner, the player view and the public page, over made-up documents and the chair's 300, every chain the
 *     Overview's line names is printed by that audience's Magic tab ("· for …"), read off the two rendered pages.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

const STORE = vi.hoisted(() => ({ reads: 0 }));
vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { STORE.reads += 1; return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => { STORE.reads += 1; return data; };
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { magicMeasuresApartLine } from '../../src/domain/display/magicMeasuresApart.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SIZES } from './pageCensusWalk.shared.mjs';

afterEach(cleanup);

const HEALING = 'Divine & Magical Healing';

/** A made-up village that leans on its parish church's healing, with next to no arcane strength. */
function madeUp() {
  return {
    name: 'Made-up Hollow', tier: 'village',
    config: { magicExists: true, priorityMagic: 50, magicLevel: 'medium' },
    institutions: [{ name: 'Parish church', category: 'Religious' }],
    npcs: [],
    defenseProfile: { scores: { magical: 5 } },
    economicState: {
      activeChains: [{
        chainId: 'divine_healing', label: HEALING, needKey: 'healing_medicine', processingInstitutions: ['Parish church'],
        outputs: ['Medical care (basic)', 'Spellcasting (minor)'], services: ['healing', 'magic'], status: 'running',
      }],
    },
  };
}

/** The same village with no house on its record to supply the magic it leans on (the Magic tab then prints no reliance line). */
function madeUpUnsupplied() {
  return { ...madeUp(), institutions: [] };
}

/** A made-up village where nothing depends on magic, beside a strong arcane strength. */
function madeUpStrong() {
  return { ...madeUp(), economicState: { activeChains: [] }, defenseProfile: { scores: { magical: 85 } } };
}

/** @param {any} v @returns {any} */
function deepFreeze(v) {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.freeze(v); for (const k of Object.keys(v)) deepFreeze(v[k]); }
  return v;
}

describe('(a) the line is composed only from the document in hand', () => {
  test('the same document twice, a copy, a frozen document: one line, no store read', () => {
    const before = STORE.reads;
    const doc = deepFreeze(madeUp());
    const first = magicMeasuresApartLine(doc);
    expect(first).toBe(`The village leans on magic for ${HEALING}, but its arcane strength is very weak.`);
    expect(magicMeasuresApartLine(doc)).toBe(first);
    expect(magicMeasuresApartLine(structuredClone(madeUp()))).toBe(first);
    expect(STORE.reads).toBe(before);
  });

  test('a document stripped of its chains names none of them', () => {
    const doc = madeUp();
    const bare = { ...doc, economicState: { ...doc.economicState, activeChains: [] } };
    const line = magicMeasuresApartLine(bare);
    expect(line === null || !line.includes(HEALING)).toBe(true);
  });
});

/** The audiences the page knows (OutputContainer.jsx): each with the document it is handed and the flags both tabs get. */
const AUDIENCES = /** @type {const} */ ([
  ['owner', (/** @type {any} */ t) => t, {}],
  ['player', (/** @type {any} */ t) => t, { playerView: true }],
  ['public', (/** @type {any} */ t) => toPublicSafe(t), { publicDossier: true }],
]);

const LEANS = /^The \S+ leans on magic for (.+), but its arcane strength is [a-z ]+\.$/;

/** @param {any} doc @param {Record<string, boolean>} flags */
function namedOnOverview(doc, flags) {
  const { container, unmount } = render(<OverviewTab settlement={doc} {...flags} />);
  const line = container.querySelector('[data-testid="overview-magic-apart"]')?.textContent ?? null;
  unmount();
  const m = line ? LEANS.exec(line) : null;
  return { line, named: m ? m[1] : null };
}

/** @param {any} doc @param {Record<string, boolean>} flags */
function printedOnMagicTab(doc, flags) {
  const { container, unmount } = render(<MagicTab settlement={doc} {...flags} />);
  const forText = container.querySelector('[data-testid="magic-reliance-for"]')?.textContent ?? '';
  unmount();
  return forText.replace(/^ · for /, '');
}

/**
 * Every chain the Overview names, printed by the same audience's Magic tab: the two lists are made by one leaf
 * (`magicRelyNames`), so the subset is read as the Overview's list being the Magic tab's list, word for word.
 * @param {string} label @param {any} record @param {string[]} failures
 */
function checkAudiences(label, record, failures) {
  let named = 0;
  for (const [audience, project, flags] of AUDIENCES) {
    const doc = project(record);
    const o = namedOnOverview(doc, flags);
    if (o.named === null) continue;
    named += 1;
    const printed = printedOnMagicTab(doc, flags);
    if (o.named !== printed) failures.push(`${label} [${audience}]: the Overview names "${o.named}", the Magic tab prints "${printed}"`);
  }
  return named;
}

describe('(b) for each audience, the chains the line names are printed by that audience\'s Magic tab', () => {
  test('made-up documents: a relied-upon village, the same with no house to supply it, a village relying on nothing', () => {
    /** @type {string[]} */ const failures = [];
    const named = checkAudiences('made-up', madeUp(), failures);
    checkAudiences('made-up, unsupplied', madeUpUnsupplied(), failures);
    checkAudiences('made-up, strong', madeUpStrong(), failures);
    expect(failures).toEqual([]);
    // The liveness anchor: the supplied village's line names its healing on all three audiences' Overviews.
    expect(named).toBe(3);
  }, 120_000);

  /** The chair's 300 (measureA's recipe): SIZES x 0..49, seed `hxd-<size>-<i>`, DEFAULT_CONFIG untouched. */
  /** @type {Array<{ seed: string, t: any }>} */ const POOL = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const size of SIZES) for (let i = 0; i < 50; i++) {
      const seed = `hxd-${size}-${i}`;
      POOL.push({ seed, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
    }
  }, 600_000);

  test('the chair\'s 300, owner, player and public', () => {
    /** @type {string[]} */ const failures = [];
    let named = 0;
    for (const { seed, t } of POOL) named += checkAudiences(seed, t, failures);
    expect(failures).toEqual([]);
    // The liveness anchor: MAGIC's measure (build/MAGIC/measure.out.txt) lists 18 of the 300 whose line names what
    // the town leans on; the line names them on every audience's page alike (3 x 18).
    expect(named).toBe(54);
  }, 900_000);
});
