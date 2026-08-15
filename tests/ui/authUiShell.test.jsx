/**
 * @vitest-environment jsdom
 *
 * tests/ui/authUiShell.test.jsx — restored auth-shell affordances (census §1 #7).
 *
 * The dedicated /signin · /register · /reset-password routes render full-bleed
 * (App suppresses the persistent nav), so the brand wordmark is the reader's
 * way back into the app. This pins the two restored affordances:
 *   - the wordmark is a real home LINK (not an inert <span>): a crawlable
 *     anchor to /create whose click preventDefaults into the SPA navigator;
 *   - the password show/hide toggle is at the 44px usability target (a
 *     consequential icon-only control), not the 36px it had regressed to.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// The wordmark's onClick routes through the SPA navigator; spy on it.
import { navigate } from '../../src/hooks/useRoute.js';
vi.mock('../../src/hooks/useRoute.js', () => ({ navigate: vi.fn(), navigatePath: vi.fn() }));

import { AuthPageShell, Input } from '../../src/components/auth/authUI.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('AuthPageShell — the wordmark home link (#7)', () => {
  test('renders the wordmark as a crawlable /create anchor that navigates on click', () => {
    render(<AuthPageShell title="Sign in">form</AuthPageShell>);
    const home = screen.getByRole('link', { name: /SettlementForge home/i });
    // Crawlable + middle-click-friendly: a real href, not a bare button.
    expect(home.getAttribute('href')).toBe('/create');
    fireEvent.click(home);
    // Click is intercepted into the SPA navigator (default navigation suppressed).
    expect(navigate).toHaveBeenCalledWith('generate');
  });
});

describe('Input — the password toggle sits at the 44px target (#7)', () => {
  test('the show/hide toggle is a 44px icon button, not 36px', () => {
    render(<Input type="password" placeholder="Password" value="" onChange={() => {}} />);
    // The password field renders exactly one button — the reveal toggle.
    const toggle = screen.getByRole('button');
    // IconButton size="xl" ⇒ a 44x44 desktop box (size="lg" would be 36).
    expect(toggle.style.width).toBe('44px');
    expect(toggle.style.height).toBe('44px');
  });
});
