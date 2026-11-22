/** @vitest-environment jsdom */
/**
 * infoPill.test.jsx — THE ? PILL (X-42): hover or focus shows the words, a tap pins them,
 * Escape and a tap outside let go; the words are the button's description either way, so a
 * screen reader hears them whether or not the bubble is open; the Section primitive wears
 * one beside its title, outside the toggle.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import InfoPill from '../../src/components/primitives/InfoPill.jsx';
import { Section } from '../../src/components/new/Primitives.jsx';

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});
afterEach(() => cleanup());

const TEXT = 'Who is at odds with whom, and how badly.';
const visible = (bubble) => bubble.style.opacity === '1';

describe('InfoPill', () => {
  it('describes its button always, shows on hover and focus, pins on tap, lets go on Escape', () => {
    render(<InfoPill text={TEXT} />);
    const button = screen.getByRole('button', { name: 'What this shows' });
    const bubble = screen.getByRole('tooltip');
    expect(bubble.textContent).toBe(TEXT);
    expect(button.getAttribute('aria-describedby')).toBe(bubble.id);
    expect(visible(bubble)).toBe(false);
    fireEvent.mouseEnter(button);
    expect(visible(bubble)).toBe(true);
    fireEvent.mouseLeave(button);
    expect(visible(bubble)).toBe(false);
    fireEvent.focus(button);
    expect(visible(bubble)).toBe(true);
    fireEvent.blur(button);
    expect(visible(bubble)).toBe(false);
    fireEvent.click(button); // a tap pins it (touch has no hover)
    expect(visible(bubble)).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(visible(bubble)).toBe(false);
  });

  it('renders nothing without words', () => {
    const { container } = render(<InfoPill text="" />);
    expect(container.querySelector('[data-testid="info-pill"]')).toBeNull();
  });

  it('a Section wears the pill beside its title, outside the toggle, on both forms', () => {
    render(<>
      <Section title="Tensions & Conflicts" collapsible defaultOpen accent="#b8860b" help={TEXT}><p>body one</p></Section>
      <Section title="Plain" help={TEXT}><p>body two</p></Section>
      <Section title="Bare" collapsible><p>body three</p></Section>
    </>);
    const pills = screen.getAllByRole('button', { name: 'What this shows' });
    expect(pills.length).toBe(2);
    const toggle = screen.getByRole('button', { name: /Tensions & Conflicts/ });
    expect(toggle.contains(pills[0]), 'the pill sits outside the toggle button').toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(screen.queryByText('body one')).toBeNull();
    expect(screen.getAllByRole('button', { name: 'What this shows' }).length, 'the pill stays while the section is folded').toBe(2);
  });
});
