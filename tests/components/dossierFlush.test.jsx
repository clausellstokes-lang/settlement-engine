/** @vitest-environment jsdom */
/**
 * dossierFlush.test.jsx — THE FLUSH RULE (the owner, 2026-11-02 UTC, X-44): "There's that
 * space that now I think it's unnecessary … a borderline boundary line from end to end of the
 * entire dossier replace it but making everything still flush."
 *
 * jsdom lays nothing out, so the pin is on the styles the rule is made of: every stacked block
 * on the Overview, the Institutions page and the Services page carries no gap below and its
 * top edge over the previous block's bottom edge (one line, not two), a stack of blocks has
 * no gap, a page that stacks blocks has no padding of its own, and a block with no edge takes
 * the hairline. The collapsible Section and Collapsible primitives carry the rule for every
 * page that uses them.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { Section, Collapsible } from '../../src/components/new/Primitives.jsx';
import { FLUSH, FLUSH_RULED, FLUSH_STACK, FLUSH_PAGE } from '../../src/design/flush.js';
import { BORDER } from '../../src/components/theme.js';

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});
afterEach(() => cleanup());

const flush = (el) => el.style.marginBottom === '0px' && el.style.marginTop === '-1px';

describe('the flush rule, its tokens', () => {
  it('a block overlaps the previous edge by one pixel; a stack has no gap; a page has no padding; a ruled block takes the hairline', () => {
    expect(FLUSH).toEqual({ marginBottom: 0, marginTop: -1 });
    expect(FLUSH_STACK).toEqual({ display: 'flex', flexDirection: 'column', gap: 0 });
    expect(FLUSH_PAGE).toEqual({ padding: 0 });
    expect(FLUSH_RULED.borderTop).toBe(`1px solid ${BORDER}`);
    expect(FLUSH_RULED.marginTop).toBe(-1);
  });
});

describe('the Overview stacks flush', () => {
  it('every bordered block under the root sits edge to edge; the crisis stack has no gap', () => {
    const s = {
      name: 'Orderby', tier: 'village', population: 300,
      arrivalScene: 'Arrival fixture scene.',
      stress: [{ label: 'Famine', colour: '#8b1a1a', summary: 'The granary is empty.', hook: 'Who hoards?' }],
      history: { currentTensions: [{ description: 'Tension fixture.' }] },
      settlementReason: 'Origin fixture.',
      structuralSuggestions: [{ reason: 'Suggestion fixture', suggested: ['A wall'] }],
      prominentRelationship: { phrasing: 'A notable connection.' },
    };
    const { container } = render(<OverviewTab settlement={s} />);
    const root = container.firstElementChild;
    const blocks = [...root.children].filter((el) => el.style.border || el.style.borderTop || el.style.background);
    expect(blocks.length).toBeGreaterThanOrEqual(5); // the strip, the place, the crisis stack, the sections, the notable connection
    const gapped = blocks.filter((el) => !flush(el));
    expect(gapped.map((el) => el.outerHTML.slice(0, 80)), 'a block with a gap below it or no overlap').toEqual([]);
    const crisisStack = [...root.children].find((el) => el.style.flexDirection === 'column');
    expect(crisisStack, 'the crisis stack').toBeTruthy();
    expect(crisisStack.style.gap).toBe('0px');
    expect(flush(crisisStack)).toBe(true);
  });
});

describe('the Institutions page stacks flush', () => {
  it('no page padding, no gap in the stack, every house over the previous edge', () => {
    const settlement = {
      name: 'Orderby',
      institutions: [{ name: 'Granary', category: 'Economy', desc: 'Grain.' }, { name: 'Inn', category: 'Economy', desc: 'Beds.' }],
      availableServices: { lodging: [{ name: 'Lodging', institution: 'Inn' }] },
    };
    const { container } = render(<InstitutionsTab settlement={settlement} />);
    expect(container.firstElementChild.style.padding).toBe('0px');
    const stack = container.querySelector('[data-testid="institutions-stack"]');
    expect(stack.style.gap).toBe('0px');
    const cards = [...container.querySelectorAll('[data-testid="institution-card"]')];
    expect(cards.length).toBe(2);
    expect(cards.every(flush)).toBe(true);
  });
});

describe('the Services page stacks flush', () => {
  it('the header strip, the search block and every category card sit edge to edge', () => {
    const services = { lodging: [{ name: 'Common room', institution: 'Inn' }], healing: [{ name: 'Herbalist' }] };
    const { container } = render(<ServicesTab services={services} settlement={{ id: 's', name: 'Orderby', tier: 'town' }} narrativeNote={null} />);
    const cats = [...container.querySelectorAll('[id^="svc-cat-"]')];
    expect(cats.length).toBe(2);
    expect(cats.every(flush)).toBe(true);
    expect(cats[0].parentElement.style.gap).toBe('0px');
    const strip = container.querySelector('[data-testid="info-pill"]').closest('div[style]').parentElement;
    expect(flush(strip)).toBe(true);
  });
});

describe('the primitives carry the rule', () => {
  it('a collapsible Section and a Collapsible overlap the previous edge', () => {
    const { container } = render(<>
      <Section title="One" collapsible><p>a</p></Section>
      <Collapsible title="Two"><p>b</p></Collapsible>
    </>);
    const [one, two] = container.children;
    expect(flush(one)).toBe(true);
    expect(flush(two)).toBe(true);
  });
});
