/** @vitest-environment jsdom */
/**
 * tests/ui/gallerySidebarRestore.test.jsx — RESTORATION #14 pins.
 *
 * The composite dropped GallerySidebar's mobile BottomSheet filter chrome and
 * the FilterChips selected-state a11y (aria-pressed + a Check glyph). These pin
 * both back.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { TIER_OPTIONS } from '../../src/components/gallery/galleryUtils.js';

let mobile = false;
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => mobile }));

afterEach(() => { cleanup(); mobile = false; });

const noop = () => {};

describe('GallerySidebar — restored affordances (RESTORATION #14)', () => {
  test('desktop FilterChips mark the selected facet with aria-pressed', async () => {
    mobile = false;
    const GallerySidebar = (await import('../../src/components/gallery/GallerySidebar.jsx')).default;
    render(<GallerySidebar filters={{ tier: [TIER_OPTIONS[0]] }} onToggleArray={noop} onToggleBool={noop} onClear={noop} isSignedIn={false} />);
    // The selected tier chip announces its on-state (was a silent gold fill only).
    expect(screen.getAllByRole('button', { pressed: true }).length).toBeGreaterThanOrEqual(1);
  });

  test('mobile moves the facet wall into a BottomSheet behind a Filters trigger', async () => {
    mobile = true;
    const GallerySidebar = (await import('../../src/components/gallery/GallerySidebar.jsx')).default;
    render(<GallerySidebar filters={{}} onToggleArray={noop} onToggleBool={noop} onClear={noop} isSignedIn={false} />);

    // The facet sections are NOT inline — they live behind the sheet trigger.
    expect(screen.queryByText('Tier')).toBeNull();
    const trigger = screen.getByRole('button', { name: /Filters/i });
    fireEvent.click(trigger);
    // Opening the sheet reveals the shared facet body.
    expect(screen.getByText('Tier')).toBeTruthy();
  });
});
