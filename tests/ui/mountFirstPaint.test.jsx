/**
 * @vitest-environment jsdom
 *
 * mountFirstPaint.test.jsx — DESK-VISIBILITY: THE FOUR POSITIONS THAT WERE LIT AND UNSEEN.
 *
 * ⛔ THE FINDING. `Primitives.jsx:114` renders a collapsed `Section` as
 * `{open && <div>{children}</div>}` — a shut fold emits NO BYTES AT ALL, not hidden ones.
 * So a corpus sentence mounted inside one is lit in `DOSSIER_MOUNTS` and dark on the page,
 * and every instrument the subsystem owns stays green: the reachability arm sees the
 * literal, the public-dossier guard sees the gate, the desk builds the rung, the DOM
 * carries nothing.
 *
 * ⭐ IT WAS NOT UNNOTICED — IT WAS WORKED AROUND, TWICE, IN WRITING, BY TWO LANDED LANES.
 * `defenseTabFlow.test.js`'s docblock names the fold and answers it with an `openSection()`
 * click helper; `economicsTabFlow.test.js` names it and answers it by choosing a fixture
 * with a real food deficit so the fold opens. Both suites went green and both readers
 * stayed dark. A cure that lives in a test fixture is not a cure, which is why these arms
 * assert FIRST PAINT with no click and no chosen fold state.
 *
 * WHAT EACH ARM PROVES, in three directions on ONE generated settlement:
 *   1. LIVENESS + FIRST PAINT — the position's node is in the DOM of the very first render,
 *      with text in it, before anything is clicked;
 *   2. OUTSIDE THE FOLD — the node is not a descendant of the collapsible that used to hold
 *      it, so the cure is a re-host and not a fold left open by luck (the fold is still
 *      there, and its own `aria-expanded` is reported);
 *   3. STILL GATED — the same town on a public dossier does not draw the corpus line, so
 *      hoisting the position above the fold did not hoist it out of the §885.3 paid gate.
 *
 * Every fixture is a GENERATED settlement: trap 4 of the desk-car law is that a fixture can
 * be the only writer of the field or the shape it grades, and three of these four positions
 * read fields a hand fixture would get to choose.
 *
 * @enforced-by itself + tests/lint/dossierMountRegistry.walker.test.js (the visibility arm)
 */
import React from 'react';
import { describe, test, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { useStore } from '../../src/store/index.js';

const e = React.createElement;

/** A spread of generated towns, so an arm is never pinned to one seed's accidents. */
const TOWNS = [];
beforeAll(() => {
  const spread = [
    ['metropolis', 'mediterranean', 'coastal', 'port'],
    ['city', 'norse', 'mountain', 'isolated'],
    ['town', 'germanic', 'plains', 'road'],
    ['village', 'celtic', 'forest', 'road'],
    ['town', 'mediterranean', 'plains', 'port'],
    ['city', 'germanic', 'coastal', 'road'],
  ];
  for (const [settType, culture, terrainOverride, tradeRouteAccess] of spread) {
    TOWNS.push(generateSettlementPipeline(
      { settType, culture, terrainOverride, tradeRouteAccess },
      null, { seed: `first-paint-${settType}-${culture}`, customContent: {} },
    ));
  }
});

afterEach(() => { cleanup(); });

/**
 * The collapsible whose header carries `title`, as the DOM sees it: the `Section` primitive
 * renders its header as a `<button aria-expanded>` inside the host `<div>`, and renders its
 * children only while open, so the host element is what "inside the fold" means.
 */
function foldOf(container, title) {
  const button = [...container.querySelectorAll('button')].find((b) => (b.textContent || '').includes(title));
  if (!button) return null;
  return { button, host: button.closest('div'), open: button.getAttribute('aria-expanded') === 'true' };
}

/**
 * Render one tab over each generated town and return the first render whose position node
 * is present, with its town. The caller asserts a town was FOUND — that is the liveness
 * anchor, and without it a position that had gone dark everywhere would pass in silence.
 */
function firstTownDrawing(Tab, selector, props = () => ({})) {
  for (const town of TOWNS) {
    const view = render(e(Tab, { settlement: town, publicDossier: false, ...props(town) }));
    const node = view.container.querySelector(selector);
    if (node) return { town, container: view.container, node };
    cleanup();
  }
  return null;
}

/** The three directions, run over one position. */
function provePosition({ Tab, selector, foldTitle, label, props = () => ({}) }) {
  const found = firstTownDrawing(Tab, selector, props);
  expect(found, `${label}: no generated town draws this position at all, so the arm is vacuous`).toBeTruthy();
  const { town, container, node } = found;

  // 1. FIRST PAINT — present, with text, before anything is clicked.
  expect(node.textContent.trim().length, `${label}: the node rendered empty`).toBeGreaterThan(0);
  const firstPaintText = node.textContent;

  // 2. OUTSIDE THE FOLD — the collapsible that used to hold it is still there, and the node
  //    is not one of its descendants. Reported with the fold's own aria state, so a reader
  //    of a failure can tell "hoisted" from "left open".
  const fold = foldOf(container, foldTitle);
  expect(fold, `${label}: the fold titled "${foldTitle}" is gone — the collapsible must not be deleted`).toBeTruthy();
  expect(fold.host.querySelector(selector),
    `${label}: the position is still INSIDE the fold "${foldTitle}" (aria-expanded=${fold.open})`).toBeNull();
  cleanup();

  // 3. STILL GATED — the same town, drawn for a free anonymous viewer, says something else
  //    or says nothing. Hoisting a position above a fold must not hoist it out of §885.3.
  const pub = render(e(Tab, { settlement: town, publicDossier: true, ...props(town) }));
  const publicNode = pub.container.querySelector(selector);
  const publicText = publicNode ? publicNode.textContent : null;
  expect(publicText, `${label}: the public dossier drew the SAME text — the paid gate did not survive the hoist`)
    .not.toBe(firstPaintText);
  return { town, firstPaintText, publicText };
}

describe('THE FIRST-PAINT LAW — the four cured positions reach a reader with no click', () => {
  test('defense.supportingCapabilities (DS-DEF-6) draws above the Supporting Capabilities fold', () => {
    const { publicText } = provePosition({
      Tab: DefenseTab,
      selector: '[data-testid="defense-supporting-lines"]',
      foldTitle: 'Supporting Capabilities',
      label: 'defense.supportingCapabilities',
      props: () => ({ narrativeNote: null }),
    });
    // The gate takes the whole block, not part of it: there is no corpus line to draw.
    expect(publicText).toBeNull();
  });

  test('overview.origin (DS-GEN-6) draws above the Settlement Origin fold', () => {
    const { publicText } = provePosition({
      Tab: OverviewTab,
      selector: '[data-testid="overview-origin-lines"]',
      foldTitle: 'Settlement Origin',
      label: 'overview.origin',
    });
    expect(publicText).toBeNull();
  });

  test('economics.foodSecurity (DS-ECO-9) draws above the Food Security fold', () => {
    useStore.setState({ campaigns: [] });
    const { publicText } = provePosition({
      Tab: EconomicsTab,
      selector: '[data-testid="economics-food-security-line"]',
      foldTitle: 'Food Security',
      label: 'economics.foodSecurity',
      props: () => ({ saveId: null }),
    });
    expect(publicText).toBeNull();
  });

  test('economics.shadowEconomy (DS-ECO-6) draws above a fold that opens on 1 town in 60', () => {
    useStore.setState({ campaigns: [] });
    // ⚠ THIS POSITION KEEPS ITS FALLBACK, so the public assertion is a DIFFERENCE and not an
    // absence: the corpus line REPLACES the tab's own `scaleNote`, so an anonymous viewer
    // still reads the scale note in the same node. Both halves are asserted non-empty, which
    // is what makes the difference a gate rather than a blank.
    const { firstPaintText, publicText } = provePosition({
      Tab: EconomicsTab,
      selector: '[data-testid="economics-shadow-economy-line"]',
      foldTitle: 'Shadow Economy',
      label: 'economics.shadowEconomy',
      props: () => ({ saveId: null }),
    });
    expect(publicText, 'the anonymous viewer lost the scale note as well as the corpus line').toBeTruthy();
    expect(publicText.trim().length).toBeGreaterThan(0);
    expect(firstPaintText).not.toBe(publicText);
  });
});
