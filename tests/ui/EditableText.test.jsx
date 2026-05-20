/**
 * @vitest-environment jsdom
 *
 * tests/ui/EditableText.test.jsx — Tier 5.4 primitive coverage.
 *
 * The EditableText primitive owns the click-to-edit lifecycle the
 * dossier's per-field edit UI depends on. These tests verify:
 *   - Read-mode renders text only; editMode=false ignores clicks
 *   - editMode=true opens an editor on click / Enter / Space
 *   - Enter commits, Esc cancels, blur commits (multiline)
 *   - Revert button fires onRevert only when isEdited
 *   - Empty-string placeholder shows when value is empty and editMode
 *   - isEdited renders the inline EditedBadge dashed-border styling
 *   - External value changes sync into the draft when not editing
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { EditableText, EditedBadge } from '../../src/components/primitives/EditableText.jsx';

afterEach(cleanup);

describe('EditableText — read mode', () => {
  test('renders the value as plain text when not in edit mode', () => {
    render(<EditableText value="Hello world" />);
    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  test('clicking does NOT open the editor when editMode=false', () => {
    const onSave = vi.fn();
    render(<EditableText value="Hello" editMode={false} onSave={onSave} />);
    fireEvent.click(screen.getByText('Hello'));
    // Still in read mode — no textarea present.
    expect(document.querySelector('textarea')).toBeNull();
  });

  test('renders placeholder when value is empty + editMode=true', () => {
    render(<EditableText value="" editMode placeholder="Click to add" />);
    expect(screen.getByText('Click to add')).toBeTruthy();
  });

  test('does NOT render placeholder when value is empty + editMode=false', () => {
    render(<EditableText value="" editMode={false} placeholder="ignored" />);
    expect(screen.queryByText('ignored')).toBeNull();
  });
});

describe('EditableText — entering edit mode', () => {
  test('clicking text opens an editor when editMode=true', () => {
    render(<EditableText value="Hello" editMode />);
    fireEvent.click(screen.getByText('Hello'));
    expect(document.querySelector('textarea')).toBeTruthy();
  });

  test('Enter key opens an editor when focused (a11y keyboard path)', () => {
    render(<EditableText value="Hello" editMode />);
    const text = screen.getByText('Hello');
    fireEvent.keyDown(text, { key: 'Enter' });
    expect(document.querySelector('textarea')).toBeTruthy();
  });

  test('Space key opens an editor when focused (a11y keyboard path)', () => {
    render(<EditableText value="Hello" editMode />);
    const text = screen.getByText('Hello');
    fireEvent.keyDown(text, { key: ' ' });
    expect(document.querySelector('textarea')).toBeTruthy();
  });

  test('opens with the current value pre-loaded', () => {
    render(<EditableText value="Pre-loaded" editMode />);
    fireEvent.click(screen.getByText('Pre-loaded'));
    const ta = document.querySelector('textarea');
    expect(ta.value).toBe('Pre-loaded');
  });

  test('single-line mode uses an <input> instead of <textarea>', () => {
    render(<EditableText value="One line" editMode multiline={false} />);
    fireEvent.click(screen.getByText('One line'));
    expect(document.querySelector('input')).toBeTruthy();
    expect(document.querySelector('textarea')).toBeNull();
  });
});

describe('EditableText — commit + cancel', () => {
  test('Enter commits the draft via onSave', () => {
    const onSave = vi.fn();
    render(<EditableText value="Old" editMode onSave={onSave} />);
    fireEvent.click(screen.getByText('Old'));
    const ta = document.querySelector('textarea');
    fireEvent.change(ta, { target: { value: 'New' } });
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSave).toHaveBeenCalledWith('New');
  });

  test('Esc cancels without calling onSave', () => {
    const onSave = vi.fn();
    render(<EditableText value="Old" editMode onSave={onSave} />);
    fireEvent.click(screen.getByText('Old'));
    const ta = document.querySelector('textarea');
    fireEvent.change(ta, { target: { value: 'Discard me' } });
    fireEvent.keyDown(ta, { key: 'Escape' });
    expect(onSave).not.toHaveBeenCalled();
    // Back in read mode.
    expect(document.querySelector('textarea')).toBeNull();
    // Original value restored.
    expect(screen.getByText('Old')).toBeTruthy();
  });

  test('blur commits the draft', () => {
    const onSave = vi.fn();
    render(<EditableText value="Old" editMode onSave={onSave} />);
    fireEvent.click(screen.getByText('Old'));
    const ta = document.querySelector('textarea');
    fireEvent.change(ta, { target: { value: 'Committed via blur' } });
    fireEvent.blur(ta);
    expect(onSave).toHaveBeenCalledWith('Committed via blur');
  });

  test('Shift+Enter inserts a newline instead of committing (multiline)', () => {
    const onSave = vi.fn();
    render(<EditableText value="" editMode onSave={onSave} />);
    fireEvent.click(screen.getByText('Click to edit'));
    const ta = document.querySelector('textarea');
    fireEvent.keyDown(ta, { key: 'Enter', shiftKey: true });
    expect(onSave).not.toHaveBeenCalled();
    expect(document.querySelector('textarea')).toBeTruthy();
  });

  test('Enter without Shift commits in single-line mode (default)', () => {
    const onSave = vi.fn();
    render(<EditableText value="Old" editMode multiline={false} onSave={onSave} />);
    fireEvent.click(screen.getByText('Old'));
    const input = document.querySelector('input');
    fireEvent.change(input, { target: { value: 'New' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).toHaveBeenCalledWith('New');
  });

  test('committing the same value does NOT call onSave (no-op)', () => {
    const onSave = vi.fn();
    render(<EditableText value="Same" editMode onSave={onSave} />);
    fireEvent.click(screen.getByText('Same'));
    const ta = document.querySelector('textarea');
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSave).not.toHaveBeenCalled();
  });
});

describe('EditableText — Revert affordance', () => {
  test('Revert button is visible in edit mode when isEdited=true', () => {
    render(
      <EditableText
        value="Edited value"
        originalValue="Original"
        isEdited
        editMode
        onRevert={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('Edited value'));
    expect(screen.getByText(/Revert/)).toBeTruthy();
  });

  test('Revert button is hidden when isEdited=false', () => {
    render(<EditableText value="Clean" editMode />);
    fireEvent.click(screen.getByText('Clean'));
    expect(screen.queryByText(/^↺ Revert$/)).toBeNull();
  });

  test('clicking Revert in read mode calls onRevert', () => {
    const onRevert = vi.fn();
    render(
      <EditableText
        value="Edited value"
        originalValue="Original"
        isEdited
        editMode
        onRevert={onRevert}
      />,
    );
    // ↺ chip is inside the read-mode span.
    const chip = screen.getByTitle(/Revert to:/i);
    fireEvent.click(chip);
    expect(onRevert).toHaveBeenCalled();
  });

  test('Revert chip is suppressed when editMode=false (clean read view)', () => {
    render(
      <EditableText
        value="Edited value"
        originalValue="Original"
        isEdited
        editMode={false}
      />,
    );
    expect(screen.queryByTitle(/Revert to:/i)).toBeNull();
  });
});

describe('EditableText — external value sync', () => {
  test('external value change updates the read-mode display', () => {
    const { rerender } = render(<EditableText value="v1" editMode={false} />);
    expect(screen.getByText('v1')).toBeTruthy();
    rerender(<EditableText value="v2" editMode={false} />);
    expect(screen.getByText('v2')).toBeTruthy();
  });

  test('external value change is ignored while the user is actively editing', () => {
    const { rerender } = render(<EditableText value="v1" editMode />);
    fireEvent.click(screen.getByText('v1'));
    const ta = document.querySelector('textarea');
    fireEvent.change(ta, { target: { value: 'draft in progress' } });

    // External change while editing — should NOT clobber the draft.
    rerender(<EditableText value="v2-external" editMode />);
    expect(document.querySelector('textarea').value).toBe('draft in progress');
  });
});

describe('EditableText — accessibility', () => {
  test('ariaLabel propagates to the read-mode element', () => {
    render(<EditableText value="Hello" editMode ariaLabel="NPC secret" />);
    expect(screen.getByLabelText('NPC secret')).toBeTruthy();
  });

  test('ariaLabel propagates to the textarea in edit mode', () => {
    render(<EditableText value="Hello" editMode ariaLabel="NPC secret" />);
    fireEvent.click(screen.getByText('Hello'));
    expect(screen.getByLabelText('NPC secret').tagName.toLowerCase()).toBe('textarea');
  });

  test('read-mode element has role="button" when editMode=true', () => {
    render(<EditableText value="Hello" editMode ariaLabel="NPC secret" />);
    expect(screen.getByRole('button').textContent).toBe('Hello');
  });

  test('read-mode element has no role when editMode=false (plain text)', () => {
    render(<EditableText value="Hello" editMode={false} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('EditedBadge', () => {
  test('renders the badge text', () => {
    render(<EditedBadge />);
    expect(screen.getByText(/Edited/)).toBeTruthy();
  });

  test('renders a count when provided', () => {
    render(<EditedBadge count={5} />);
    expect(screen.getByText(/Edited · 5/)).toBeTruthy();
  });

  test('hides the count when 0', () => {
    render(<EditedBadge count={0} />);
    expect(screen.getByText(/Edited$/)).toBeTruthy();
  });

  test('carries a descriptive tooltip', () => {
    render(<EditedBadge />);
    const badge = screen.getByTitle(/user-edited prose/i);
    expect(badge).toBeTruthy();
  });
});
