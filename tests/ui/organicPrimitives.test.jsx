/**
 * @vitest-environment jsdom
 *
 * tests/ui/organicPrimitives.test.jsx — the manuscript primitives render and
 * carry the right hooks (Organic Craft law §3/§6). Not a pixel test (jsdom has no
 * layout) — it pins the affordance contract: rules are decorative, the register is
 * a container-query grid, the dropcap needs no wrapper markup a screen reader would
 * split, field mode is a single class swap, and the rubric is a real element.
 */
import { describe, expect, it, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import Rule from '../../src/components/organic/Rule.jsx';
import { Register, Marginalia } from '../../src/components/organic/Register.jsx';
import { Surface, Display, Prose, Rubric, Ink, Eyebrow } from '../../src/components/organic/Manuscript.jsx';

afterEach(cleanup);

describe('Rule', () => {
  it('renders a decorative SVG line and can collapse to a whitespace fallback', () => {
    const { container } = render(<Rule variant="double" />);
    const el = container.querySelector('.oc-rule--double');
    expect(el).not.toBeNull();
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('svg')).not.toBeNull();

    cleanup();
    const { container: c2 } = render(<Rule variant="single" asSpace />);
    expect(c2.querySelector('svg')).toBeNull(); // collapsed to space
    expect(c2.firstChild.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('Register + Marginalia', () => {
  it('is a container-query register with a body and a gloss margin channel', () => {
    const { container } = render(
      <Register gloss={<Marginalia label="a note">the gloss</Marginalia>}>
        <p>main block</p>
      </Register>,
    );
    expect(container.querySelector('.oc-register')).not.toBeNull();
    expect(container.querySelector('.oc-register__body')).not.toBeNull();
    const gloss = container.querySelector('.oc-register__gloss');
    expect(gloss).not.toBeNull();
    // Marginalia is a real tap target (details/summary) with content in flow.
    const details = gloss.querySelector('details.oc-margin-note');
    expect(details).not.toBeNull();
    expect(details.querySelector('summary')).not.toBeNull();
  });
});

describe('Manuscript surface + text primitives', () => {
  it('field mode is a single class swap on the surface', () => {
    const { container } = render(<Surface field posture="field"><span>x</span></Surface>);
    const s = container.querySelector('.oc-surface');
    expect(s.classList.contains('oc-field')).toBe(true);
    expect(s.getAttribute('data-posture')).toBe('field');
  });

  it('the dropcap illuminates the initial with NO wrapper markup (::first-letter)', () => {
    const { container } = render(<Prose dropcap><p>Once upon a realm…</p></Prose>);
    const prose = container.querySelector('.oc-prose');
    expect(prose.classList.contains('oc-dropcap')).toBe(true);
    // The text is a single flow node — the letter is styled via CSS ::first-letter,
    // not a <span> that a screen reader would split off.
    expect(prose.querySelector('span')).toBeNull();
  });

  it('display, eyebrow, rubric and ink render as real, class-tagged elements', () => {
    const { container } = render(
      <Surface>
        <Eyebrow>Surveyor’s desk</Eyebrow>
        <Display size="xl" as="h1">Thornwall</Display>
        <Rubric role="instruction">Begin here</Rubric>
        <Ink tone="secondary">a gloss</Ink>
      </Surface>,
    );
    expect(container.querySelector('h1.oc-display.oc-display--xl')).not.toBeNull();
    expect(container.querySelector('.oc-eyebrow')).not.toBeNull();
    expect(container.querySelector('.oc-rubric--instruction')).not.toBeNull();
    expect(container.querySelector('.oc-ink-secondary')).not.toBeNull();
  });
});
