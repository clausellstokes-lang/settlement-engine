/** @vitest-environment jsdom */
/**
 * CommandPaletteHost.test.jsx — the eager hotkey sliver (Vision V-H, R-20).
 *
 * The host is the only eager piece: a window cmd/ctrl-K listener that toggles the
 * lazy palette. Pinned: nothing renders until the chord fires; cmd-K opens the
 * (stubbed) palette; a second cmd-K toggles it closed; ctrl-K works too.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, waitFor } from '@testing-library/react';

// Stub the lazy body so the host test stays isolated from the store/routes.
vi.mock('../../src/components/CommandPalette.jsx', () => ({
  default: () => <div data-testid="palette-stub" />,
}));

import CommandPaletteHost from '../../src/components/CommandPaletteHost.jsx';

afterEach(cleanup);

const chord = (key, mod) => window.dispatchEvent(new KeyboardEvent('keydown', { key, ...mod }));

describe('CommandPaletteHost — the cmd/ctrl-K sliver', () => {
  it('renders nothing until the chord fires', () => {
    render(<CommandPaletteHost />);
    expect(screen.queryByTestId('palette-stub')).toBeNull();
  });

  it('cmd-K opens the palette, and a second cmd-K closes it', async () => {
    render(<CommandPaletteHost />);
    chord('k', { metaKey: true });
    expect(await screen.findByTestId('palette-stub')).toBeTruthy();
    chord('k', { metaKey: true });
    await waitFor(() => expect(screen.queryByTestId('palette-stub')).toBeNull());
  });

  it('ctrl-K also opens the palette', async () => {
    render(<CommandPaletteHost />);
    chord('k', { ctrlKey: true });
    expect(await screen.findByTestId('palette-stub')).toBeTruthy();
  });

  it('ignores plain k and modified chords with alt/shift', () => {
    render(<CommandPaletteHost />);
    chord('k', {});
    chord('k', { metaKey: true, altKey: true });
    chord('k', { ctrlKey: true, shiftKey: true });
    expect(screen.queryByTestId('palette-stub')).toBeNull();
  });
});
