/**
 * @vitest-environment jsdom
 *
 * tests/ui/uiA11yWave5.test.jsx — Cycle-3 Wave 5 per-finding a11y pins.
 *
 * Each pin reproduces the finding's failure and clears it against the fix that
 * routes the surface through an EXISTING primitive:
 *   • H12 EntityPicker  — combobox grammar: arrows + Enter add through addRef.
 *   • M9  GalleryDescriptionEditor — the toolbar answers the KEYBOARD (onClick).
 *   • M12 TableView     — useDialogFocusTrap: focus-in, Escape, focus-restore.
 *   • M13 SurveyorGlossary — the trap survives a parent re-render (keyed on
 *     `open`, not the onClose identity) — the recorded focus-yank bug.
 *   • H13 PurchaseModal — the dialog is viewport-bounded and scrolls (no clip).
 *
 * The structural companion (no NEW mouse-only control / hand-rolled trap /
 * ad-hoc zIndex) is tests/lint/uiA11yContract.walker.test.js.
 */

import React, { useState } from 'react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, within } from '@testing-library/react';

// EntityPicker is the only surface here that reads the store / custom registry;
// the mock is inert for every other component in this file (none call useStore).
vi.mock('../../src/store/index.js', () => ({ useStore: (sel) => sel({ customContent: {} }) }));
vi.mock('../../src/lib/customRegistry.js', () => ({
  buildRegistry: () => ({
    listAll: () => ([
      { refId: 'prebuilt:institutions:a', name: 'Alpha', subcategory: 'One', source: 'prebuilt' },
      { refId: 'prebuilt:institutions:b', name: 'Beta', subcategory: 'Two', source: 'prebuilt' },
    ]),
    resolve: (id) => ({ refId: id, name: id, source: 'prebuilt' }),
  }),
}));

import EntityPicker from '../../src/components/EntityPicker.jsx';
import GalleryDescriptionEditor from '../../src/components/GalleryDescriptionEditor.jsx';
import TableView from '../../src/components/TableView.jsx';
import SurveyorGlossary from '../../src/components/guidance/SurveyorGlossary.jsx';
import { GLOSSARY } from '../../src/domain/display/glossary.js';

afterEach(cleanup);

// ── H12 — EntityPicker keyboard operation ────────────────────────────────────
describe('H12 — EntityPicker suggestion list is keyboard-operable', () => {
  test('Enter on the combobox adds the active suggestion through addRef', () => {
    const onChange = vi.fn();
    render(<EntityPicker category="institutions" value={[]} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // Before Wave 5 the input had no onKeyDown, so Enter was inert (the list was
    // mouse-only). Now Enter commits the active (first) suggestion.
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['prebuilt:institutions:a']);
  });

  test('ArrowDown moves the active option, then Enter adds it', () => {
    const onChange = vi.fn();
    render(<EntityPicker category="institutions" value={[]} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['prebuilt:institutions:b']);
  });

  test('the suggestion list is a listbox of options wired to the input', () => {
    render(<EntityPicker category="institutions" value={[]} onChange={vi.fn()} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeTruthy();
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(2);
    // Options are not tab stops — the combobox input owns the keyboard.
    expect(options[0].getAttribute('tabindex')).toBe('-1');
    expect(input.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
  });
});

// ── M9 — GalleryDescriptionEditor toolbar keyboard operation ──────────────────
describe('M9 — GalleryDescriptionEditor toolbar answers the keyboard', () => {
  test('the toolbar exposes a toolbar role and labelled controls', () => {
    render(<GalleryDescriptionEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('toolbar')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeTruthy();
  });

  test('a keyboard-style activation (click detail 0) runs the command pipeline', () => {
    const onChange = vi.fn();
    render(<GalleryDescriptionEditor value="" onChange={onChange} />);
    const bold = screen.getByRole('button', { name: 'Bold' });
    // Enter/Space on a focused button fire a click with detail 0 — the keyboard
    // path this fix added. Before Wave 5 the button had no onClick, so this was
    // inert (mouse-only onMouseDown). Now it runs exec + emit → onChange.
    fireEvent.click(bold, { detail: 0 });
    expect(onChange).toHaveBeenCalled();
  });
});

// ── M12 — TableView focus trap ───────────────────────────────────────────────
describe('M12 — TableView traps focus (useDialogFocusTrap)', () => {
  const settlement = { name: 'Testburg', tier: 'Town', population: 900 };

  test('focus moves into the dialog on open and the panel is the modal', () => {
    render(<TableView settlement={settlement} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    // The trap moved focus off the body and into the dialog panel.
    expect(document.activeElement).not.toBe(document.body);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  test('Escape closes via the shared trap', () => {
    const onClose = vi.fn();
    render(<TableView settlement={settlement} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('focus is restored to the trigger on unmount', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
    const { unmount } = render(<TableView settlement={settlement} onClose={vi.fn()} />);
    expect(document.activeElement).not.toBe(trigger); // moved into the dialog
    unmount();
    expect(document.activeElement).toBe(trigger);     // and restored
    trigger.remove();
  });
});

// ── M13 — SurveyorGlossary focus trap keyed on OPEN, not onClose identity ─────
describe('M13 — the glossary trap survives a background re-render', () => {
  const validId = GLOSSARY.entries[0]?.id;

  function Harness() {
    const [n, setN] = useState(0);
    return (
      <div>
        <button type="button" onClick={() => setN((x) => x + 1)}>bump {n}</button>
        <SurveyorGlossary id={validId} />
      </div>
    );
  }

  test('a parent re-render (new onClose identity) does NOT yank focus out', () => {
    expect(validId, 'glossary must derive at least one entry').toBeTruthy();
    render(<Harness />);
    // Open the card.
    fireEvent.click(screen.getByRole('button', { name: /What is/i }));
    const dialog = screen.getByRole('dialog');
    // Move focus to the LAST focusable (the "Read more" link), not the first.
    const link = within(dialog).getByRole('link');
    link.focus();
    expect(document.activeElement).toBe(link);
    // Force the parent to re-render — SurveyorGlossary re-renders and hands
    // GlossaryCard a fresh `() => setOpen(false)` onClose. The old effect keyed
    // on that identity re-ran and yanked focus to the first control; keyed on
    // `open`, the trap stays put.
    fireEvent.click(screen.getByRole('button', { name: /bump/i }));
    expect(document.activeElement).toBe(link);
  });
});

// ── H13 — PurchaseModal dialog is viewport-bounded and scrolls (no clip) ──────
// PurchaseModal pulls the whole checkout stack (stripe/pricing/referral/captcha)
// on import; the fix is a pure style change, so this pins the exact bounding
// contract at the source rather than mounting the full purchase surface.
describe('H13 — PurchaseModal bounds its dialog and scrolls inside', () => {
  const src = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../src/components/PurchaseModal.jsx'),
    'utf8',
  );
  // The dialog block (role="dialog" ... style={{ ... }}).
  const dialogStyle = src.slice(src.indexOf('aria-labelledby="purchase-modal-title"'), src.indexOf('{/* Header */}'));

  test('the dialog caps its height to the viewport', () => {
    expect(dialogStyle).toMatch(/maxHeight:\s*'min\(90vh/);
  });
  test('the dialog scrolls its overflow instead of clipping it', () => {
    expect(dialogStyle).toMatch(/overflowY:\s*'auto'/);
    expect(dialogStyle).not.toMatch(/overflow:\s*'hidden'/);
  });
});
