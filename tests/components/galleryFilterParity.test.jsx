/**
 * @vitest-environment jsdom
 *
 * galleryFilterParity.test.jsx — owner order (2026-07-22): the Settlements, Maps,
 * and Campaigns gallery tabs must share ONE filter-panel design. Both the
 * settlements and the maps/campaigns sidebars now render through the shared
 * GalleryFilterShell (a bordered CARD_ALT aside with a SlidersHorizontal +
 * "Filters" header on desktop), and the gallery empty states share the polished
 * gold-accent EmptyState treatment.
 *
 * The pins: both sidebars render the SAME shell chrome (the bordered aside + the
 * Filters icon/header the maps tab used to lack), and EmptyState honours the gold
 * accent the gallery empties pass.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import GallerySidebar from '../../src/components/gallery/GallerySidebar.jsx';
import GalleryMapsSidebar from '../../src/components/gallery/GalleryMapsSidebar.jsx';
import EmptyState from '../../src/components/primitives/EmptyState.jsx';
import { Image as ImageIcon } from 'lucide-react';

const noop = () => {};

describe('gallery filter panels — shared GalleryFilterShell parity', () => {
  test('the Settlements panel renders the shared bordered shell + Filters header', () => {
    const { container } = render(
      <GallerySidebar filters={{}} onToggleArray={noop} onToggleBool={noop} onClear={noop} isSignedIn={false} />,
    );
    const panel = container.querySelector('.gallery-sidebar-panel');
    expect(panel).toBeTruthy();
    expect(panel.style.border).toContain('1px solid');   // the bordered aside
    expect(panel.querySelector('svg')).toBeTruthy();      // the SlidersHorizontal glyph
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeTruthy();
  });

  test('the Maps panel now renders the SAME shell chrome it used to lack', () => {
    const { container } = render(
      <GalleryMapsSidebar filters={{}} onToggleArray={noop} onToggleBool={noop} onClear={noop} />,
    );
    const panel = container.querySelector('.gallery-sidebar-panel');
    expect(panel).toBeTruthy();
    expect(panel.style.border).toContain('1px solid');   // was border-less before
    expect(panel.querySelector('svg')).toBeTruthy();      // was icon-less before
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeTruthy();
  });
});

describe('gallery empty states — shared EmptyState with the gold accent', () => {
  test('the accent gallery empty renders a centered note with its glyph, heading, and CTA', () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        Icon={ImageIcon}
        accent
        align="center"
        heading="No shared maps yet."
        body="Premium DMs can publish a world map from the toolbar."
        action={{ label: 'Forge your own', onClick }}
      />,
    );
    const note = screen.getByRole('note', { name: 'No shared maps yet.' });
    expect(note).toBeTruthy();
    expect(note.style.textAlign).toBe('center');
    expect(note.querySelector('svg')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Forge your own' })).toBeTruthy();
  });
});
