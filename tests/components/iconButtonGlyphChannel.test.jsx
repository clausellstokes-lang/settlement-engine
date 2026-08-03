/** @vitest-environment jsdom */
/**
 * iconButtonGlyphChannel.test.jsx — IconButton's icons-off channel (lane LU-2).
 *
 * WHY THIS FILE EXISTS SEPARATELY FROM lucideTotality. That ratchet's
 * GATE_PRIMITIVES list means "imports lucide-react but renders it only through
 * useIconsOn", and it PROVES membership by scanning the source for both. That
 * proof cannot reach IconButton, which imports no lucide at all — it receives
 * `Icon` as a prop from its call site. So the primitive that the sweep depends
 * on most is precisely the one the source-scan ratchet is blind to, and its
 * gate consultation is pinned here, behaviourally, instead.
 *
 * WHAT IS BEING PROTECTED. The LU-2 sweep deletes `Icon={X}` and the lucide
 * import from ~52 call sites and passes `glyph` in their place. Every one of
 * those conversions is only safe because of the four render arms below. If an
 * arm regresses, the failure is silent and product-wide: a toolbar of empty
 * labelled boxes, which is exactly the shape that kept IconButton outside the
 * gate until now.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import IconButton from '../../src/components/primitives/IconButton.jsx';
import { IconsContext } from '../../src/components/primitives/IconsContext.js';

/** A stand-in for a lucide glyph: renders a marker we can assert on. */
const Sword = ({ size }) => <svg data-testid="lucide" width={size} />;

const inMap = (ui) => <IconsContext.Provider value={true}>{ui}</IconsContext.Provider>;

describe('IconButton — the icons-off text-twin channel', () => {
  afterEach(() => cleanup());

  test('ARM 1 icons OFF + glyph: the text twin renders and the icon does not', () => {
    render(<IconButton glyph="×" Icon={Sword} label="Dismiss" />);
    expect(screen.getByText('×')).toBeTruthy();
    expect(screen.queryByTestId('lucide')).toBeNull();
  });

  test('ARM 2 no Icon at all: the twin renders even INSIDE the map Provider', () => {
    // The fail-safe. A converted call site keeps no lucide import, so if it is
    // ever mounted inside the map subtree there is no `Icon` to fall back to.
    // It must render the twin, never an empty box.
    render(inMap(<IconButton glyph="+" label="Add" />));
    expect(screen.getByText('+')).toBeTruthy();
    expect(screen.getByRole('button').textContent).not.toBe('');
  });

  test('ARM 3 icons ON + both channels: the real glyph wins inside the map', () => {
    render(inMap(<IconButton glyph="×" Icon={Sword} label="Dismiss" />));
    expect(screen.getByTestId('lucide')).toBeTruthy();
    expect(screen.queryByText('×')).toBeNull();
  });

  test('ARM 4 UNCONVERTED call site is byte-identical to pre-LU-2 behaviour', () => {
    // The property that lets this land ahead of the sweep: no `glyph` means the
    // icon renders, icons-off or not, exactly as the old primitive did. If this
    // reds, the sweep's incremental safety is gone.
    render(<IconButton Icon={Sword} label="Dismiss" />);
    expect(screen.getByTestId('lucide')).toBeTruthy();
    render(inMap(<IconButton Icon={Sword} label="Edit" />));
    expect(screen.getAllByTestId('lucide').length).toBe(2);
  });

  test('the twin never steals the accessible name, and keeps the tooltip', () => {
    // The twin is decoration for the same reason the icon was: the NAME is the
    // required label. An aria-hidden twin keeps screen readers on the label and
    // stops "times Dismiss" style double-reads.
    render(<IconButton glyph="×" label="Dismiss banner" />);
    const button = screen.getByRole('button', { name: 'Dismiss banner' });
    expect(button.getAttribute('title')).toBe('Dismiss banner');
    expect(screen.getByText('×').getAttribute('aria-hidden')).toBe('true');
  });

  test('the twin does not change the control box: same size, tone, and button semantics', () => {
    // Layout neutrality is the whole reason the chair picked the twin over
    // "render the label as text". A converted toolbar must not reflow.
    const { container: withIcon } = render(<IconButton Icon={Sword} label="A" size="lg" />);
    const { container: withTwin } = render(<IconButton glyph="×" label="A" size="lg" />);
    const a = withIcon.querySelector('button');
    const b = withTwin.querySelector('button');
    expect(b.style.width).toBe(a.style.width);
    expect(b.style.height).toBe(a.style.height);
    expect(b.style.border).toBe(a.style.border);
    expect(b.tagName).toBe('BUTTON');
    expect(b.getAttribute('type')).toBe('button');
  });

  test('NEGATIVE CONTROL: neither channel throws in development', () => {
    // A guard that never fires is indistinguishable from a guard that cannot.
    // This is the empty-labelled-box failure, caught at the call site.
    expect(() => render(<IconButton label="Nothing to show" />)).toThrow(/`Icon` or `glyph`/);
  });

  test('NEGATIVE CONTROL: the required-label throw still fires', () => {
    expect(() => render(<IconButton glyph="×" />)).toThrow(/label/);
  });
});
