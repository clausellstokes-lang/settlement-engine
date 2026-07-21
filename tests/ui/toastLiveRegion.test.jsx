/** @vitest-environment jsdom */
/**
 * tests/ui/toastLiveRegion.test.jsx — SB5: the announce-on-CHANGE contract for
 * polite toasts (WCAG 4.1.3 Status Messages).
 *
 * role=alert announces reliably on insertion, but a role=status region that
 * mounts TOGETHER with its text is announced inconsistently across screen
 * readers — the region must pre-exist empty and then change. These pins hold
 * that contract at the Toast primitive (the chokepoint) and at the world map's
 * live toast (WorldMapOverlays — which previously carried NO live semantics at
 * all), plus the no-double-reading rule: the visible non-error text is
 * aria-hidden because the persistent region carries the same words.
 */
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

// Keep the overlays test to the toast surface: the tour and the lazy
// simulation-rules dialog are closed-by-default siblings with heavy graphs.
vi.mock('../../src/components/map/WorldMapTour.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/SimulationRulesDialog.jsx', () => ({ default: () => null }));

import Toast from '../../src/components/primitives/Toast.jsx';
import { WorldMapOverlays } from '../../src/components/map/WorldMapOverlays.jsx';

afterEach(cleanup);

describe('Toast primitive — persistent polite region (SB5)', () => {
  it('the polite region pre-exists EMPTY and the toast text lands in that SAME node', () => {
    const { container, rerender } = render(<Toast toast={null} />);
    const region = container.querySelector('[role="status"]');
    expect(region).not.toBeNull();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');
    rerender(<Toast toast={{ kind: 'success', text: 'Saved' }} />);
    // Same DOM node (a text CHANGE, not a region insertion) now carries the text.
    expect(container.querySelector('[role="status"]')).toBe(region);
    expect(region.textContent).toBe('Saved');
  });

  it('the visible non-error box is aria-hidden — the words are read once, from the region', () => {
    const { container } = render(<Toast toast={{ kind: 'info', text: 'A note' }} />);
    const box = container.querySelector('.oc-m-slipin');
    expect(box).not.toBeNull();
    expect(box.getAttribute('aria-hidden')).toBe('true');
  });

  it('an error toast interrupts via role=alert and is NOT mirrored into the polite region', () => {
    const { container } = render(<Toast toast={{ kind: 'error', text: 'Save failed' }} />);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert.getAttribute('aria-live')).toBe('assertive');
    expect(alert.textContent).toContain('Save failed');
    expect(container.querySelector('[role="status"]').textContent).toBe('');
  });
});

describe('WorldMapOverlays toast — persistent polite region (SB5)', () => {
  it('the polite region pre-exists EMPTY with no toast', () => {
    const { container } = render(<WorldMapOverlays toast={null} />);
    const region = container.querySelector('[role="status"]');
    expect(region).not.toBeNull();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');
  });

  it('a non-error toast is announced through the region; the visible span is aria-hidden', () => {
    const { container } = render(<WorldMapOverlays toast={{ kind: 'success', text: 'Map saved' }} />);
    expect(container.querySelector('[role="status"]').textContent).toBe('Map saved');
    // The visible copy of the words is hidden from assistive tech (no double read).
    const hidden = container.querySelector('span[aria-hidden="true"]');
    expect(hidden).not.toBeNull();
    expect(hidden.textContent).toBe('Map saved');
  });

  it('an error toast is role=alert and its recovery action stays in the a11y tree', () => {
    const onClick = vi.fn();
    const { container } = render(
      <WorldMapOverlays toast={{ kind: 'error', text: 'Canonize first', action: { label: 'Canonize', onClick } }} />,
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toContain('Canonize first');
    // The action button must never be aria-hidden — only the text span mirror is.
    expect(screen.getByRole('button', { name: 'Canonize' })).toBeTruthy();
    expect(container.querySelector('[role="status"]').textContent).toBe('');
  });
});
