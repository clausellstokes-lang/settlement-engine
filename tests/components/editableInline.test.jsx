/** @vitest-environment jsdom */
/**
 * editableInline.test.jsx - Contract over the click-to-edit primitive.
 *
 * EditableInline is used by every per-field edit surface in the
 * dossier (NPC names, faction labels, summary prose, sample card
 * teaching fields). Pinning behavior here protects every consumer
 * from a future refactor drift in focus management or commit semantics.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import EditableInline from '../../src/components/primitives/EditableInline.jsx';

describe('EditableInline', () => {
  // RTL's automatic-cleanup hook only registers when the test runner
  // exposes Jest globals or vitest is configured with `globals: true`.
  // We don't enable globals (keeps `describe`/`it` explicit), so we
  // call cleanup() ourselves to ensure each test renders into a fresh
  // tree - otherwise `getByRole('button')` matches buttons left over
  // from prior tests.
  afterEach(cleanup);
  it('renders the value in read-only mode', () => {
    render(<EditableInline value="Hightower's Reach" onCommit={() => {}} />);
    expect(screen.getByText("Hightower's Reach")).toBeTruthy();
  });

  it('switches to edit mode on click', () => {
    render(<EditableInline value="Velda" onCommit={() => {}} ariaLabel="Edit NPC name" />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('Velda');
    expect(input.tagName).toBe('INPUT');
  });

  it('commits on Enter for single-line', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="A" onCommit={onCommit} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('A');
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCommit).toHaveBeenCalledWith('B');
  });

  it('cancels on Escape - no commit, value reverts', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="A" onCommit={onCommit} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('A');
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onCommit).not.toHaveBeenCalled();
    // Display reverts to original
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('commits on blur unless empty', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="A" onCommit={onCommit} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('A');
    fireEvent.change(input, { target: { value: 'C' } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith('C');
  });

  it('empty + !allowEmpty → reverts on blur, no commit', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="A" onCommit={onCommit} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('A');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('allowEmpty=true lets empty commit', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="A" allowEmpty onCommit={onCommit} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('A');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith('');
  });

  it('validate=fn blocks invalid commit + surfaces error', () => {
    const onCommit = vi.fn();
    const validate = (v) => v.length >= 2 ? true : 'Too short';
    render(<EditableInline value="ab" onCommit={onCommit} validate={validate} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('ab');
    fireEvent.change(input, { target: { value: 'x' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByText('Too short')).toBeTruthy();
  });

  it('disabled=true does not enter edit mode on click', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="A" onCommit={onCommit} disabled />);
    fireEvent.click(screen.getByRole('button'));
    // Still in read-only mode → no input element
    expect(screen.queryByDisplayValue('A')).toBeNull();
  });

  it('multiline renders a textarea + Shift+Enter commits', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="line 1" onCommit={onCommit} multiline />);
    fireEvent.click(screen.getByRole('button'));
    const ta = screen.getByDisplayValue('line 1');
    expect(ta.tagName).toBe('TEXTAREA');
    fireEvent.change(ta, { target: { value: 'line 1\nline 2' } });
    fireEvent.keyDown(ta, { key: 'Enter', shiftKey: true });
    expect(onCommit).toHaveBeenCalledWith('line 1\nline 2');
  });

  it('no-op commit (value unchanged) does not fire onCommit', () => {
    const onCommit = vi.fn();
    render(<EditableInline value="A" onCommit={onCommit} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('A');
    fireEvent.blur(input);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('keyboard activation (Enter / Space) opens edit mode', () => {
    render(<EditableInline value="A" onCommit={() => {}} />);
    const trigger = screen.getByRole('button');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByDisplayValue('A')).toBeTruthy();
  });

  it('placeholder renders when value is empty in read-only mode', () => {
    render(<EditableInline value="" onCommit={() => {}} placeholder="Click to name" />);
    expect(screen.getByText('Click to name')).toBeTruthy();
  });
});
