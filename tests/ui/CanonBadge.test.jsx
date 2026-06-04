/**
 * @vitest-environment jsdom
 *
 * tests/ui/CanonBadge.test.jsx - Tier 5.3 surface tests.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { CanonBadge } from '../../src/components/primitives/CanonBadge.jsx';

afterEach(cleanup);

describe('CanonBadge - silent default', () => {
  test('renders nothing for generated + draft entities (the silent majority)', () => {
    const { container } = render(<CanonBadge entity={{ id: 'x', name: 'X' }} />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null for null / non-object input', () => {
    const { container: c1 } = render(<CanonBadge entity={null} />);
    expect(c1.firstChild).toBeNull();
    cleanup();
    const { container: c2 } = render(<CanonBadge entity={'string'} />);
    expect(c2.firstChild).toBeNull();
  });
});

describe('CanonBadge - populated variants', () => {
  test('user-authored entity renders the user chip', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _authored: true }} />);
    expect(screen.getByText(/user-authored/i)).toBeTruthy();
  });

  test('event-applied entity renders the event chip', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', appliedAt: '2026-01-01T00:00:00Z' }} />);
    expect(screen.getByText(/event-applied/i)).toBeTruthy();
  });

  test('ai_overlay entity renders the AI chip', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _aiOverlay: true }} />);
    expect(screen.getByText(/ai/i)).toBeTruthy();
  });

  test('locked generated entity renders the canon chip', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', locked: true }} />);
    expect(screen.getByText(/^canon$/i)).toBeTruthy();
  });

  test('superseded entity renders the superseded chip regardless of source', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _authored: true, superseded: true }} />);
    expect(screen.getByText(/superseded/i)).toBeTruthy();
  });
});

describe('CanonBadge - lock indicator', () => {
  test('shows lock icon when entity is locked AND showLock=true (default)', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _authored: true, locked: true }} />);
    // The role=status outer span carries the entire chip content.
    expect(screen.getByRole('status').textContent).toMatch(/🔒/);
  });

  test('omits lock icon when showLock=false', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _authored: true, locked: true }} showLock={false} />);
    expect(screen.getByRole('status').textContent).not.toMatch(/🔒/);
  });

  test('omits lock icon for an entity that lacks the locked flag', () => {
    // verbose=true forces a chip even for the generated+draft state
    // (which has locked:false by default). Verbose-default uses a
    // plain span without role=status so query by textContent.
    const { container } = render(<CanonBadge entity={{ id: 'x', name: 'X' }} verbose />);
    expect(container.textContent).not.toMatch(/🔒/);
  });
});

describe('CanonBadge - verbose mode', () => {
  test('verbose=true forces a chip even for generated+draft', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X' }} verbose />);
    // Verbose default chip uses "source·status" text.
    expect(screen.getByText(/generated·draft/i)).toBeTruthy();
  });
});

describe('CanonBadge - accessibility', () => {
  test('exposes role=status', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _authored: true }} />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  test('aria-label describes the canon state', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _authored: true, locked: true }} />);
    expect(screen.getByLabelText(/user-authored, locked/i)).toBeTruthy();
  });

  test('the title attribute matches the aria-label for sighted hover', () => {
    render(<CanonBadge entity={{ id: 'x', name: 'X', _authored: true }} />);
    const chip = screen.getByRole('status');
    expect(chip.getAttribute('title')).toMatch(/user-authored/);
  });
});
