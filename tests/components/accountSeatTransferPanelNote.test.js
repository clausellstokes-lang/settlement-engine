/**
 * accountSeatTransferPanelNote.test.js — a11y-2 regression pin (WCAG 4.1.3).
 *
 * The founder seat-transfer + buyback panels announced ERRORS (role="alert") but
 * not SUCCESS, stranding screen-reader users after a money action. noteAria is
 * the single mapping every Note renders through: danger is an assertive alert;
 * success + muted announce politely (role="status"), matching the
 * AccountAutoReloadPanel sibling. Pin the mapping so success can never fall
 * silent again.
 */
import { describe, it, expect } from 'vitest';
import { noteAria } from '../../src/components/account/AccountSeatTransferPanel.jsx';

describe('AccountSeatTransferPanel Note — a11y announcement mapping (a11y-2)', () => {
  it('success outcomes are announced politely (role=status)', () => {
    expect(noteAria('success')).toEqual({ role: 'status', 'aria-live': 'polite' });
  });

  it('muted status notices are announced politely (role=status)', () => {
    expect(noteAria('muted')).toEqual({ role: 'status', 'aria-live': 'polite' });
  });

  it('danger stays an assertive alert', () => {
    expect(noteAria('danger')).toEqual({ role: 'alert', 'aria-live': 'assertive' });
  });

  it('every tone resolves to a live-region role — none is silent', () => {
    for (const tone of ['success', 'muted', 'danger', undefined]) {
      const aria = noteAria(tone);
      expect(['status', 'alert']).toContain(aria.role);
      expect(['polite', 'assertive']).toContain(aria['aria-live']);
    }
  });
});
