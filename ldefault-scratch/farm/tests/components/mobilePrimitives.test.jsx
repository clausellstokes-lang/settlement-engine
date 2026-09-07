/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import BottomSheet from '../../src/components/primitives/BottomSheet.jsx';
import DesktopOnlyGate from '../../src/components/primitives/DesktopOnlyGate.jsx';
import MobileTabStrip from '../../src/components/primitives/MobileTabStrip.jsx';

describe('mobile foundation primitives', () => {
  afterEach(() => cleanup());

  // ── BottomSheet ───────────────────────────────────────────────────────────
  test('BottomSheet opens on trigger and renders title + children as a dialog', () => {
    render(
      <BottomSheet title="Filters" triggerLabel="Filters">
        <p>Sheet body</p>
      </BottomSheet>,
    );
    // Closed initially: no dialog, body not present.
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('Sheet body')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    // Labelled by the header heading.
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByText('Sheet body')).toBeTruthy();
  });

  test('BottomSheet shows a count badge on the trigger only when count > 0', () => {
    const { rerender } = render(
      <BottomSheet title="Filters" count={0}>x</BottomSheet>,
    );
    const trigger = screen.getByRole('button', { name: /Filters/i });
    expect(trigger.textContent).not.toMatch(/\d/);
    rerender(<BottomSheet title="Filters" count={3}>x</BottomSheet>);
    expect(screen.getByRole('button', { name: /Filters/i }).textContent).toMatch(/3/);
  });

  test('BottomSheet closes on the close button and fires onClose', () => {
    const onClose = vi.fn();
    render(<BottomSheet title="Filters" onClose={onClose}>x</BottomSheet>);
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('BottomSheet closes on Escape', () => {
    render(<BottomSheet title="Filters">x</BottomSheet>);
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // ── DesktopOnlyGate ─────────────────────────────────────────────────────────
  test('DesktopOnlyGate gate variant shows the message and an optional CTA, no teaser', () => {
    render(
      <DesktopOnlyGate
        variant="gate"
        title="Best on a larger screen"
        message="Author this on desktop."
        cta={<a href="/x">Learn more</a>}
      >
        <div>teaser-only</div>
      </DesktopOnlyGate>,
    );
    expect(screen.getByRole('heading', { name: 'Best on a larger screen' })).toBeTruthy();
    expect(screen.getByText('Author this on desktop.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeTruthy();
    // gate variant must NOT render its children.
    expect(screen.queryByText('teaser-only')).toBeNull();
  });

  test('DesktopOnlyGate teaser variant renders inert children plus the message', () => {
    const { container } = render(
      <DesktopOnlyGate variant="teaser" message="Open on desktop to edit.">
        <button type="button">Inert control</button>
      </DesktopOnlyGate>,
    );
    expect(screen.getByText('Open on desktop to edit.')).toBeTruthy();
    // Children render, but inside an aria-hidden, pointer-events:none wrapper.
    const teaser = container.querySelector('[aria-hidden="true"]');
    expect(teaser).toBeTruthy();
    expect(teaser.style.pointerEvents).toBe('none');
    expect(teaser.textContent).toContain('Inert control');
  });

  test('DesktopOnlyGate copy carries no em dash or exclamation point', () => {
    const { container } = render(<DesktopOnlyGate variant="gate" />);
    expect(container.textContent).not.toMatch(/[—!]/);
  });

  // ── MobileTabStrip ──────────────────────────────────────────────────────────
  const TABS = [
    { id: 'power', label: 'Power' },
    { id: 'economics', label: 'Economics' },
    { id: 'npcs', label: 'NPCs' },
  ];

  test('MobileTabStrip renders a tablist with the selected tab marked', () => {
    render(<MobileTabStrip tabs={TABS} value="economics" onChange={() => {}} ariaLabel="Dossier tabs" />);
    expect(screen.getByRole('tablist', { name: 'Dossier tabs' })).toBeTruthy();
    const selected = screen.getByRole('tab', { selected: true });
    expect(selected.textContent).toBe('Economics');
    // Roving tabIndex: only the active tab is tabbable.
    expect(selected.getAttribute('tabindex')).toBe('0');
  });

  test('MobileTabStrip fires onChange when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<MobileTabStrip tabs={TABS} value="power" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'NPCs' }));
    expect(onChange).toHaveBeenCalledWith('npcs');
  });

  test('MobileTabStrip arrow keys move selection (focus follows selection)', () => {
    const onChange = vi.fn();
    render(<MobileTabStrip tabs={TABS} value="power" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('economics');
  });

  test('MobileTabStrip End/Home jump to the ends', () => {
    const onChange = vi.fn();
    render(<MobileTabStrip tabs={TABS} value="power" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'End' });
    expect(onChange).toHaveBeenCalledWith('npcs');
    onChange.mockClear();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith('power');
  });
});
