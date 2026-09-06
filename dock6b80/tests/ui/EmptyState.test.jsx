/** @vitest-environment jsdom */
/**
 * EmptyState.test.jsx — the designed-empty-room primitive's contract (R-22).
 *
 * Pins: it renders the invitation (heading + body); it is one labelled a11y
 * region (role="note" named by the heading) so a screen reader meets the empty
 * state as a unit; the optional CTA renders and fires only when wired; and it
 * never re-introduces a native `title=` (the tooltip census offender) nor a
 * `title` prop, so the primitive stays census-clean by construction.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../../src/components/primitives/EmptyState.jsx';

afterEach(cleanup);

describe('EmptyState — the designed empty room', () => {
  it('renders the heading and body copy', () => {
    render(<EmptyState heading="No shared maps yet." body="Publish one from the toolbar." />);
    expect(screen.getByText('No shared maps yet.')).toBeTruthy();
    expect(screen.getByText('Publish one from the toolbar.')).toBeTruthy();
  });

  it('is one labelled note region named by its heading', () => {
    render(<EmptyState heading="No chronicle yet." body="Narrate an advance to open the log." />);
    const note = screen.getByRole('note');
    expect(note).toBeTruthy();
    expect(note.getAttribute('aria-label')).toBe('No chronicle yet.');
  });

  it('renders no call to action when none is wired', () => {
    render(<EmptyState heading="Empty" body="Nothing here." />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the CTA and fires its handler when an action is provided', () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        heading="No campaign"
        body="Start one."
        action={{ label: 'Create a campaign', onClick }}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Create a campaign' });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('never emits a native title attribute (tooltip census safe)', () => {
    const { container } = render(<EmptyState heading="No news yet." body="Advance the realm to fill this." />);
    expect(container.querySelector('[title]')).toBeNull();
  });
});
