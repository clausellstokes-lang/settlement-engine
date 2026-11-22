/** @vitest-environment jsdom */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Badge from '../../src/components/primitives/Badge.jsx';
import Button from '../../src/components/primitives/Button.jsx';
import IconButton from '../../src/components/primitives/IconButton.jsx';
import Disclosure from '../../src/components/primitives/Disclosure.jsx';
import { ConfirmDialog, TextInputDialog } from '../../src/components/primitives/Dialog.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('design primitives', () => {
  afterEach(() => cleanup());

  test('Button renders a disabled busy state', () => {
    render(<Button busy>Working</Button>);
    const button = screen.getByRole('button');
    expect(button.disabled).toBe(true);
    expect(screen.getByText('Working')).toBeTruthy();
  });

  test('Badge supports removable chips', () => {
    const onRemove = vi.fn();
    render(<Badge onRemove={onRemove}>Merchant League</Badge>);

    fireEvent.click(screen.getByLabelText('Remove'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('Disclosure hides and reveals content', () => {
    render(<Disclosure title="Institutions">Granary</Disclosure>);

    expect(screen.queryByText('Granary')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Institutions/i }));
    expect(screen.getByText('Granary')).toBeTruthy();
  });

  test('ConfirmDialog calls confirm and cancel handlers', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Reset to draft?"
        body="This cannot be undone."
        confirmLabel="Reset"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText('Reset'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('TextInputDialog submits the entered value', () => {
    const onConfirm = vi.fn();
    render(
      <TextInputDialog
        open
        title="Edit label text"
        label="Label text"
        initialValue="Old"
        onConfirm={onConfirm}
      />,
    );

    const input = screen.getByLabelText('Label text');
    fireEvent.change(input, { target: { value: 'New Label' } });
    fireEvent.click(screen.getByText('Save'));

    expect(onConfirm).toHaveBeenCalledWith('New Label');
  });
});

// ── Interactive state-set completeness (Fix wave 4, idx7 / bar 17) ──────────
// The primitives must carry the COMPLETE interactive state set — hover,
// focus-visible, active, disabled — and each leg must be real machinery, not
// dead data. The audit found Button had NO hover at all and IconButton's
// per-tone hover values were defined but never applied. The mechanism: the
// primitives publish --sf-btn-bg (+ --sf-btn-hover-bg for designed hover
// data) and a11y.css's .sf-btn rules turn them into a working hover. These
// pins make the class unable to regress: drop the sf-btn class, the custom
// property, or the CSS rule, and the census below goes red.
describe('button primitives — interactive state-set completeness', () => {
  afterEach(() => cleanup());

  const a11yCss = readFileSync(join(ROOT, 'src/styles/a11y.css'), 'utf8');
  const organicCss = readFileSync(join(ROOT, 'src/styles/organic.css'), 'utf8');
  const DummyIcon = ({ size }) => <svg width={size} height={size} />;

  // The variant/tone censuses — keep in lockstep with the primitives' tables.
  const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost', 'danger', 'ai', 'aiSolid', 'success', 'warning', 'info', 'gold'];
  const ICON_TONES = ['default', 'primary', 'ghost', 'active', 'danger', 'inverse'];

  test('HOVER machinery exists: a11y.css styles .sf-btn from the published custom properties', () => {
    expect(a11yCss).toMatch(/\.sf-btn\s*\{[^}]*var\(--sf-btn-bg/);
    // Hover rule: excludes disabled, prefers the designed hover fill, and
    // derives a fallback from the base fill (no variant can opt out).
    expect(a11yCss).toMatch(/\.sf-btn:hover:not\(:disabled\)\s*\{[^}]*var\(--sf-btn-hover-bg/);
    expect(a11yCss).toMatch(/\.sf-btn:hover:not\(:disabled\)\s*\{[^}]*color-mix/);
  });

  test('FOCUS-VISIBLE + ACTIVE floors the primitives lean on are present', () => {
    expect(a11yCss).toMatch(/\*:focus-visible\s*\{[^}]*outline:/);
    expect(organicCss).toMatch(/\.oc-m-press:active\s*\{/);
  });

  test('every Button variant publishes its fill for the hover machinery', () => {
    for (const variant of BUTTON_VARIANTS) {
      const { unmount } = render(<Button variant={variant}>Label</Button>);
      const el = screen.getByRole('button');
      expect(el.className, `variant ${variant} carries sf-btn`).toContain('sf-btn');
      expect(el.className, `variant ${variant} carries the press state`).toContain('oc-m-press');
      expect(el.style.getPropertyValue('--sf-btn-bg'), `variant ${variant} publishes --sf-btn-bg`).toBeTruthy();
      unmount();
    }
  });

  test('every IconButton tone APPLIES its designed hover fill (no dead data)', () => {
    for (const tone of ICON_TONES) {
      const { unmount } = render(<IconButton Icon={DummyIcon} label={`tone ${tone}`} tone={tone} />);
      const el = screen.getByRole('button', { name: `tone ${tone}` });
      expect(el.className, `tone ${tone} carries sf-btn`).toContain('sf-btn');
      expect(el.style.getPropertyValue('--sf-btn-bg'), `tone ${tone} publishes --sf-btn-bg`).toBeTruthy();
      expect(el.style.getPropertyValue('--sf-btn-hover-bg'), `tone ${tone} applies its TONES.hover`).toBeTruthy();
      unmount();
    }
  });

  test('a pressed IconButton hovers with the active tone, and DISABLED keeps its inert treatment', () => {
    render(<IconButton Icon={DummyIcon} label="pressed toggle" pressed />);
    const pressedEl = screen.getByRole('button', { name: 'pressed toggle' });
    expect(pressedEl.style.getPropertyValue('--sf-btn-hover-bg')).toBe('rgba(160,118,42,0.18)');
    cleanup();

    render(<Button disabled>Held</Button>);
    const disabledEl = screen.getByRole('button');
    expect(disabledEl.disabled).toBe(true);
    expect(disabledEl.style.opacity).toBe('0.62');
    expect(disabledEl.style.cursor).toBe('not-allowed');
  });
});
