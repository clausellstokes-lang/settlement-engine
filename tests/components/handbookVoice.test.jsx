/** @vitest-environment jsdom */
/**
 * handbookVoice.test.jsx — V-26b contract: the Keeper's Handbook house-voice rewrite is
 * ⭐ LIT BY DEFAULT (lighting wave POSITION 4 / L-UI, owner row O-13, ODQ §882.1; lane
 * L-UI-MAT, 2026-09-06). It was STAGED DARK until that flip.
 *
 * ⛔ THE POLARITY OF THIS FILE'S DEFAULT ARM IS THE THING THAT CHANGED, AND IT IS THE ONLY
 * THING. `handbookVoice` now ships `true`, so the arm that previously rendered with NO
 * override to observe the DARK copy would silently have become a second ON test — a pin
 * that still passes while proving nothing. Both states are still pinned; which one is
 * reached by the default is now spelled EXPLICITLY on every arm, so a future flip in
 * either direction reds here instead of quietly re-labelling what these tests cover.
 *
 * The pins:
 *   • flag OFF (explicit override) ⇒ the exact original handbook copy still renders and the
 *     voiced draft is absent — the plain register is preserved, not deleted, so the flip
 *     stays a one-line revert (both versions coexist; the existing howToInversion pin
 *     proves the order/anchors still hold with the flag off);
 *   • flag ON (THE SHIPPED DEFAULT — asserted with no override, so this arm is what a real
 *     reader gets) ⇒ the voiced narrative renders and the plain essay copy is gone;
 *   • THE CLARITY CLAUSE: the clarity-mandated surfaces — the numbered how-to steps and
 *     the Compendium reference lifeline — stay plain in BOTH states.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { setFlagOverride } from '../../src/lib/flags.js';
import { VOICED_ANCHOR, VOICED_HEADER } from '../../src/components/howto/HandbookVoiced.jsx';
import HowToUse from '../../src/components/HowToUse.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** Order W2-e — the About page splits into two collapsibles; the Keeper's Handbook
 *  (which carries the voiced/plain header + the essay copy) is COLLAPSED by default.
 *  Open it so its content renders for these copy assertions. */
function expandHandbook(container) {
  const btn = [...container.querySelectorAll('button[aria-expanded]')]
    .find(b => /Keeper/i.test(b.textContent));
  if (btn && btn.getAttribute('aria-expanded') === 'false') fireEvent.click(btn);
}

// Register-exclusive anchors (each phrase appears in exactly one voice).
const PLAIN_ONLY = 'Coherence follows from constraint';
const VOICED_ONLY = 'Coherence is the reward for constraint';
// Clarity-mandated surfaces that must survive the flip untouched.
const STEPS = 'First settlement in 60 seconds';
const LIFELINE = 'Compendium';

describe('HowToUse — V-26b handbook voice (staged dark)', () => {
  afterEach(() => { setFlagOverride('handbookVoice', null); cleanup(); });

  it('flag OFF (explicit override): the original handbook copy renders; the voiced draft is absent', () => {
    // EXPLICIT, because OFF is no longer the default (O-13). Rendering bare here would
    // observe the lit copy and this arm would assert the opposite of its own name.
    setFlagOverride('handbookVoice', false);
    const { container } = render(<HowToUse standalone />);
    expandHandbook(container);
    expect(container.textContent).toContain(PLAIN_ONLY);
    expect(container.textContent).toContain('The practical guide');
    expect(container.textContent).not.toContain(VOICED_ONLY);
  });

  it('flag ON (the shipped default): the voiced narrative renders and the plain essay copy is gone', () => {
    // NO override on purpose — this arm now pins the SHIPPED DEFAULT, so it reds if the
    // flag is ever darkened without this contract being revisited.
    const { container } = render(<HowToUse standalone />);
    expandHandbook(container);
    expect(container.textContent).toContain(VOICED_ONLY);
    expect(container.textContent).toContain(VOICED_HEADER.eyebrow);
    expect(container.textContent).not.toContain(PLAIN_ONLY);
  });

  it('THE CLARITY CLAUSE: the steps + Compendium lifeline stay plain in BOTH states', () => {
    setFlagOverride('handbookVoice', false);
    const off = render(<HowToUse standalone />);
    expandHandbook(off.container);
    expect(off.container.textContent).toContain(STEPS);
    expect(off.container.textContent).toContain(LIFELINE);
    // The plain register really is the one being observed here, not the lit one by another
    // name — without this the clause would pass vacuously on two identical ON renders.
    expect(off.container.textContent).toContain(PLAIN_ONLY);
    off.unmount();

    setFlagOverride('handbookVoice', null); // back to the shipped default, which is now ON
    const on = render(<HowToUse standalone />);
    expandHandbook(on.container);
    expect(on.container.textContent).toContain(STEPS);   // action steps unchanged
    expect(on.container.textContent).toContain(LIFELINE); // findability preserved
    expect(on.container.textContent).toContain(VOICED_ONLY); // and it IS the voiced register
  });
});

// ── §906 VIS — THE FIRST-PAINT LAW over the guide page ───────────────────────
/**
 * ⛔ THE PINS ABOVE PROVE THE COPY, NOT THE READER — and one of their own helpers
 * is why. `expandHandbook` (:33) exists to click a collapsed "Keeper's Handbook"
 * fold open before asserting, and its docblock states the page "is COLLAPSED by
 * default". That is the exact shape DESK-VISIBILITY's FIRST-PAINT LAW was written
 * to refuse: tests/lint/dossierMountRegistry.walker.test.js:1294-1299 names two
 * landed suites (defenseTabFlow, economicsTabFlow) that went green through an
 * `openSection()` click while their readers stayed dark, and rules that "a cure
 * that lives in a test fixture is not a cure".
 *
 * MEASURED AT 0eb028111, the premise is no longer true — the fold is already gone:
 *   • `HowToUse()` (HowToUse.jsx:429) takes NO PROPS. `standalone` has been inert
 *     since the de-collapse; the pins above pass it, AppViews.jsx:133 does not, and
 *     both mount the identical tree. The first test below asserts that equivalence
 *     rather than assuming it, because the whole value of these pins depends on the
 *     suite rendering what the route renders.
 *   • `GuideSection` (HowToUse.jsx:73-81) is a plain <section> + <h2> + unconditional
 *     `{children}` — "the de-collapsed replacement for a former tab … always open
 *     (design §3)", :70-71. It offers no `defaultOpen`, no `aria-expanded`, no toggle.
 *   • The voiced header is `<PageHeader {...header} />` at :454, a direct child of
 *     `<Page>` — above every GuideSection, so no fold could enclose it even if one
 *     returned. The voiced essay forks at :263, inside QuickStart, inside the
 *     "quick" GuideSection at :458.
 * So these pins take NO interaction at all: no `expandHandbook`, no click. If a fold
 * is ever reintroduced over this page, the first test reds instead of being quietly
 * clicked open.
 */
describe('§906 — the voiced Handbook is READ on first paint of /about/guide', () => {
  afterEach(() => { setFlagOverride('handbookVoice', null); cleanup(); });

  /**
   * THE DOM HALF of the first-paint law: no ancestor between the surface and the
   * container root hides it. Named per element so a failure says which one.
   * @param {Element} el @param {Element} root @param {string} label
   */
  function expectNoHiddenAncestor(el, root, label) {
    for (let node = el; node; node = node.parentElement) {
      const how = node.hasAttribute('hidden') ? 'the `hidden` attribute'
        : node.getAttribute('aria-hidden') === 'true' ? 'aria-hidden="true"'
          : node.style?.display === 'none' ? 'an inline display:none'
            : node.getAttribute('aria-expanded') === 'false' ? 'aria-expanded="false" (a shut fold)'
              : null;
      expect(
        how,
        `FIRST-PAINT LAW [${label}]: <${node.tagName.toLowerCase()}> on the host chain hides`
        + ` the surface with ${how}. A lit sentence a reader cannot see is dark.`,
      ).toBeNull();
      if (node === root) break;
    }
  }

  it('the voiced header and essay are in the accessible DOM with NO interaction, exactly as AppViews mounts it', () => {
    // No override: the SHIPPED default (handbookVoice: true, flagRegistry.js:117).
    // No prop: AppViews.jsx:46 renders `<HowToUse />`, and so does this.
    const { container } = render(<HowToUse />);

    // (b) THE PROSE. The title is the page's <h1> through PageHeader's `as`, so this
    // is the accessible tree, not a text scrape.
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain(VOICED_HEADER.title);
    expect(container.textContent).toContain(VOICED_HEADER.eyebrow);
    expect(container.textContent).toContain(VOICED_HEADER.subtitleLead);
    // …and one sentence of the voiced essay itself, five sections down the page.
    expect(container.textContent).toContain(VOICED_ANCHOR);

    // (c) THE DOM HALF of the law, for the header and for the essay separately —
    // they sit at different depths (PageHeader is a child of Page; the essay is
    // inside QuickStart inside a GuideSection), so one chain does not cover both.
    expectNoHiddenAncestor(h1, container, 'guide → voiced header');
    const essay = [...container.querySelectorAll('p')].find(p => p.textContent.includes(VOICED_ANCHOR));
    expect(essay, 'the voiced essay paragraph did not render at all').toBeTruthy();
    expectNoHiddenAncestor(essay, container, 'guide → voiced essay');

    // (c) THE FOLD HALF, at the DOM level this time, because this page's primitives
    // expose no fold to source-read: there is no collapsed control over the handbook
    // for a reader to have to find. This is the assertion that retires the stale
    // `expandHandbook` premise — if a fold comes back, it reds here.
    const keeperFolds = [...container.querySelectorAll('button[aria-expanded]')]
      .filter(b => /Keeper/i.test(b.textContent || ''));
    expect(
      keeperFolds.length,
      'a collapsed "Keeper" control reappeared over the guide: the voiced copy is behind'
      + ' a click again, and the pins above would be clicking it open instead of proving it.',
    ).toBe(0);
  });

  it('`standalone` is inert: the suite\'s mount and the AppViews mount render the same tree', () => {
    // The pins at the head of this file pass `standalone`; AppViews does not. If that
    // prop ever starts changing the host chain, every assertion above is being made
    // against a page no reader visits — so the equivalence is pinned, not assumed.
    const withProp = render(<HowToUse standalone />);
    const propText = withProp.container.textContent;
    withProp.unmount();
    const bare = render(<HowToUse />);
    expect(bare.container.textContent).toBe(propText);
    // Non-vacuous: both really rendered the voiced page.
    expect(propText).toContain(VOICED_ANCHOR);
  });

  it('NEGATIVE CONTROL: with the flag forced OFF the same first paint carries none of the voiced register', () => {
    setFlagOverride('handbookVoice', false);
    const { container } = render(<HowToUse />);
    // The anchor is the PLAIN copy at the very same fork (HowToUse.jsx:263 and the
    // header object at :441-447), so it proves the page is live and the register is
    // simply the other one — not that the page failed to render.
    expectAbsentWithAnchor(
      container.textContent,
      VOICED_HEADER.eyebrow,
      'The practical guide',
      'handbookVoice OFF ⇒ the voiced eyebrow is dark on first paint of the guide',
    );
    expectAbsentWithAnchor(
      container.textContent,
      VOICED_ANCHOR,
      'Coherence follows from constraint',
      'handbookVoice OFF ⇒ the voiced essay is dark on first paint of the guide',
    );
  });
});
