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
import { render, cleanup, fireEvent } from '@testing-library/react';
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
 * One town's whole answer for one position, read from TWO renders: the private dossier
 * (what a paying reader sees on first paint) and the public one (what the §885.3 gate
 * leaves). Both are captured BEFORE cleanup, because a container's textContent empties
 * when its tree unmounts.
 */
function readPosition(Tab, town, selector, foldTitle, props) {
  const priv = render(e(Tab, { settlement: town, publicDossier: false, ...props(town) }));
  const node = priv.container.querySelector(selector);
  const fold = foldOf(priv.container, foldTitle);
  const record = {
    town,
    text: node ? node.textContent : null,
    foldPresent: !!fold,
    foldOpen: fold ? fold.open : null,
    insideFold: !!(fold && fold.host.querySelector(selector)),
  };
  cleanup();
  const pub = render(e(Tab, { settlement: town, publicDossier: true, ...props(town) }));
  const publicNode = pub.container.querySelector(selector);
  record.publicText = publicNode ? publicNode.textContent : null;
  cleanup();
  return record;
}

/**
 * The three directions, run over the first generated town that actually DRAWS the position.
 *
 * ⚠ "DRAWS" IS `the private text differs from the public one`, NOT `the node exists`, AND
 * THE FIRST DRAFT OF THIS FILE GOT IT WRONG. `economics.shadowEconomy` keeps a fallback: its
 * node renders the tab's own `scaleNote` when the corpus is silent, so a node-presence test
 * selected a town where nothing corpus-side had drawn and then asserted the gate against it.
 * The gate is what REMOVES the corpus line, so a difference between the two renders is the
 * only evidence available that a corpus line was there — which is why, for that one position,
 * the selection and the gate proof are the same act and are stated to be.
 */
function provePosition({ Tab, selector, foldTitle, label, props = () => ({}) }) {
  const seen = TOWNS.map((town) => readPosition(Tab, town, selector, foldTitle, props));
  const drawn = seen.find((r) => r.text && r.text.trim() && r.publicText !== r.text);
  expect(drawn,
    `${label}: no generated town draws this position, so the arm would be vacuous`
    + ` (${seen.filter((r) => r.text).length}/${seen.length} towns rendered the node at all)`).toBeTruthy();

  // 1. FIRST PAINT — present, with text, before anything is clicked.
  expect(drawn.text.trim().length, `${label}: the node rendered empty`).toBeGreaterThan(0);

  // 2. OUTSIDE THE FOLD — the collapsible that used to hold it is still there, and the node
  //    is not one of its descendants. Reported with the fold's own aria state, so a reader of
  //    a failure can tell "hoisted" from "left open by luck".
  expect(drawn.foldPresent,
    `${label}: the fold titled "${foldTitle}" is gone — the collapsible must not be deleted`).toBe(true);
  expect(drawn.insideFold,
    `${label}: the position is still INSIDE the fold "${foldTitle}" (aria-expanded=${drawn.foldOpen})`).toBe(false);

  return drawn;
}

describe('THE FIRST-PAINT LAW — the four cured positions reach a reader with no click', () => {
  test('guard the guard: the fold reader addresses the fold\'s OWN container, and a shut fold really holds nothing', () => {
    // ⛔ WITHOUT THIS ARM THE CONTAINMENT CHECK ABOVE COULD PASS VACUOUSLY. `foldOf` walks
    // from the header button to `closest('div')`; if that resolved to some inner wrapper
    // that could never hold the fold's children, every "not inside the fold" assertion in
    // this file would be true for the wrong reason. So: the container is proved to be the
    // one that GAINS the fold's children when the header is clicked.
    const { container } = render(e(DefenseTab, { settlement: TOWNS[0], narrativeNote: null, publicDossier: false }));
    const shut = foldOf(container, 'Supporting Capabilities');
    expect(shut, 'the Supporting Capabilities fold is gone').toBeTruthy();
    expect(shut.open, 'the fold is not shut on first paint, so this arm proves nothing').toBe(false);
    const before = shut.host.textContent;
    // anchored: `after` below is asserted to contain a string absent here, on the same node
    expect(before).not.toContain('Economic Backing');
    fireEvent.click(shut.button);
    const opened = foldOf(container, 'Supporting Capabilities');
    const after = opened.host.textContent;
    expect(opened.open, 'the click did not open the fold').toBe(true);
    expect(after.length, 'the container did not gain the fold\'s children, so it is the wrong node')
      .toBeGreaterThan(before.length);
    expect(after).toContain('Economic Backing');
    // …and the cured position is STILL outside it, in BOTH fold states.
    expect(opened.host.querySelector('[data-testid="defense-supporting-lines"]')).toBeNull();
    expect(container.querySelector('[data-testid="defense-supporting-lines"]')).toBeTruthy();
  });

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
    const { text, publicText } = provePosition({
      Tab: EconomicsTab,
      selector: '[data-testid="economics-shadow-economy-line"]',
      foldTitle: 'Shadow Economy',
      label: 'economics.shadowEconomy',
      props: () => ({ saveId: null }),
    });
    expect(publicText, 'the anonymous viewer lost the scale note as well as the corpus line').toBeTruthy();
    expect(publicText.trim().length).toBeGreaterThan(0);
    // The gate proof for THIS position is the difference `provePosition` selected on, stated
    // rather than asserted twice: the corpus line replaces `scaleNote`, so an anonymous
    // viewer still reads a sentence in the same node and only its WORDS change.
    expect(text).not.toBe(publicText);
  });
});
