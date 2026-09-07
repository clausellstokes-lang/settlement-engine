/**
 * @vitest-environment jsdom
 *
 * galleryFilterParity.test.jsx — owner order (2026-07-22): the Settlements, Maps,
 * and Campaigns gallery tabs must share ONE filter-panel design. Both the
 * settlements and the maps/campaigns sidebars now render through the shared
 * GalleryFilterShell (a bordered CARD_ALT aside with a "Filters" header on
 * desktop), and the gallery empty states share one EmptyState treatment.
 *
 * The pins: both sidebars render the SAME shell chrome (the bordered aside + the
 * Filters header the maps tab used to lack), and EmptyState renders its surviving
 * channels.
 *
 * UPDATED BY LANE LU-2 (icons-off burn-down), and the reason matters. Three of
 * these assertions used `querySelector('svg')` as the PROXY for "this panel has
 * the shared chrome" — the shell's SlidersHorizontal glyph and EmptyState's gold
 * accent glyph. Both glyphs were lucide rendered OUTSIDE the map Provider, i.e.
 * exactly what the ratified icons-off redesign suppresses, so the proxy pinned a
 * violation in place. The owner order being protected here is parity of DESIGN
 * across the three tabs, not the presence of artwork; the parity assertions now
 * ride the channels that survive icons-off (the bordered aside, the "Filters"
 * heading, the note's heading/body/CTA). The svg checks are INVERTED rather than
 * deleted, so the removal is pinned and a re-added glyph reds here as well as in
 * tests/lint/lucideTotality.test.js.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import GallerySidebar from '../../src/components/gallery/GallerySidebar.jsx';
import GalleryMapsSidebar from '../../src/components/gallery/GalleryMapsSidebar.jsx';
import EmptyState from '../../src/components/primitives/EmptyState.jsx';

const noop = () => {};

describe('gallery filter panels — shared GalleryFilterShell parity', () => {
  test('the Settlements panel renders the shared bordered shell + Filters header', () => {
    const { container } = render(
      <GallerySidebar filters={{}} onToggleArray={noop} onToggleBool={noop} onClear={noop} isSignedIn={false} />,
    );
    const panel = container.querySelector('.gallery-sidebar-panel');
    expect(panel).toBeTruthy();
    expect(panel.style.border).toContain('1px solid');   // the bordered aside
    expect(panel.querySelector('svg')).toBeNull();        // icons-off: no glyph survives here
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeTruthy();
  });

  test('the Maps panel now renders the SAME shell chrome it used to lack', () => {
    const { container } = render(
      <GalleryMapsSidebar filters={{}} onToggleArray={noop} onToggleBool={noop} onClear={noop} />,
    );
    const panel = container.querySelector('.gallery-sidebar-panel');
    expect(panel).toBeTruthy();
    expect(panel.style.border).toContain('1px solid');   // was border-less before
    expect(panel.querySelector('svg')).toBeNull();        // icons-off, same as its sibling
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeTruthy();
  });
});

describe('gallery empty states — one shared EmptyState treatment', () => {
  test('the gallery empty renders a centered note with heading, body, and CTA', () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        align="center"
        heading="No shared maps yet."
        body="Premium DMs can publish a world map from the toolbar."
        action={{ label: 'Forge your own', onClick }}
      />,
    );
    const note = screen.getByRole('note', { name: 'No shared maps yet.' });
    expect(note).toBeTruthy();
    expect(note.style.textAlign).toBe('center');
    expect(screen.getByText('Premium DMs can publish a world map from the toolbar.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Forge your own' })).toBeTruthy();
  });

  test('EmptyState carries NO leading-glyph channel (lane LU-2)', () => {
    // The `Icon`/`accent` pair rendered lucide ungated on all four of its call
    // sites, every one of them a gallery surface outside the map Provider. The
    // channel was deleted with them; this pin stops it being quietly restored,
    // and would also catch an inline <svg> smuggled in as a replacement.
    const { container } = render(
      <EmptyState align="center" heading="No shared maps yet." body="Nothing here." />,
    );
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.getByRole('note', { name: 'No shared maps yet.' })).toBeTruthy();
  });
});
